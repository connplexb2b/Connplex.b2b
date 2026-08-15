import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { Investor, InvestorFileType, InvestorFile } from '@/lib/media-utils';
import { connectToDatabase } from '@/lib/db';
import { Investor as InvestorModel } from '@/models/Investor';
import { InvestorFileContent as InvestorFileContentModel } from '@/models/InvestorFileContent';

export type { Investor, InvestorFileType, InvestorFile };
export { formatDate, formatFileSize, getAcceptForType } from '@/lib/media-utils';

const DATA_PATH = path.join(process.cwd(), 'data', 'admin-investors.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'investors');

const PDF_MIME = new Set(['application/pdf']);
const AUDIO_MIME = new Set([
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/mp4',
  'audio/m4a',
  'audio/x-m4a',
  'audio/ogg',
  'audio/webm',
  'audio/aac',
]);

export function isAllowedMime(type: InvestorFileType, mime: string): boolean {
  if (type === 'pdf') return PDF_MIME.has(mime) || mime === 'application/octet-stream';
  return AUDIO_MIME.has(mime) || mime.startsWith('audio/');
}

export async function ensureUploadDir(investorId: string): Promise<string> {
  const dir = path.join(UPLOAD_DIR, investorId);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export async function readInvestors(): Promise<Investor[]> {
  try {
    await connectToDatabase();
    
    // Find all investors in DB
    const docs = await InvestorModel.find({}).sort({ updatedAt: -1 }).lean();
    
    if (docs.length === 0) {
      // Seed fallback from local JSON
      try {
        const raw = await fs.readFile(DATA_PATH, 'utf-8');
        const list = JSON.parse(raw) as Investor[];
        if (list.length > 0) {
          await InvestorModel.insertMany(
            list.map(item => ({
              id: item.id,
              title: item.title,
              type: item.type,
              parent: item.parent || '',
              files: item.files.map(f => ({
                id: f.id,
                originalName: f.originalName,
                storedName: f.storedName,
                url: f.url,
                mimeType: f.mimeType,
                size: f.size
              }))
            }))
          );
          return list;
        }
      } catch (seedErr) {
        console.error('Failed to seed investors from local JSON file:', seedErr);
      }
    }
    
    return docs.map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      type: doc.type,
      parent: doc.parent || '',
      files: doc.files.map((f: any) => ({
        id: f.id,
        originalName: f.originalName,
        storedName: f.storedName,
        url: f.url,
        mimeType: f.mimeType,
        size: f.size
      })),
      updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString()
    })) as Investor[];
  } catch (error) {
    console.error('Error reading investors from MongoDB:', error);
    try {
      const raw = await fs.readFile(DATA_PATH, 'utf-8');
      return JSON.parse(raw) as Investor[];
    } catch {
      return [];
    }
  }
}

export async function writeInvestors(investors: Investor[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  try {
    await fs.chmod(DATA_PATH, 0o666);
  } catch (e) {}
  try {
    await fs.writeFile(DATA_PATH, JSON.stringify(investors, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Silent warning: Failed to write database backup to local filesystem:', e.message);
  }
}

export async function getInvestor(id: string): Promise<Investor | null> {
  await connectToDatabase();
  const doc = await InvestorModel.findOne({ id }).lean();
  if (!doc) return null;
  return {
    id: doc.id,
    title: doc.title,
    type: doc.type as InvestorFileType,
    parent: doc.parent || '',
    files: doc.files.map((f: any) => ({
      id: f.id,
      originalName: f.originalName,
      storedName: f.storedName,
      url: f.url,
      mimeType: f.mimeType,
      size: f.size
    })),
    updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString()
  };
}

export async function createInvestor(data: {
  title: string;
  type: InvestorFileType;
  parent?: string;
}): Promise<Investor> {
  await connectToDatabase();
  const id = randomUUID();
  const investorData = {
    id,
    title: data.title.trim(),
    type: data.type,
    parent: data.parent?.trim() || '',
    files: [],
  };
  const doc = await InvestorModel.create(investorData);
  
  // Try to write to local JSON for fallback asynchronously
  readInvestors().then(writeInvestors).catch(() => {});

  return {
    id: doc.id,
    title: doc.title,
    type: doc.type as InvestorFileType,
    parent: doc.parent,
    files: [],
    updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString()
  };
}

export async function updateInvestor(
  id: string,
  data: { title?: string; type?: InvestorFileType; parent?: string }
): Promise<Investor | null> {
  await connectToDatabase();
  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.type !== undefined) updateData.type = data.type;
  if (data.parent !== undefined) updateData.parent = data.parent.trim();

  const doc = await InvestorModel.findOneAndUpdate({ id }, { $set: updateData }, { new: true }).lean();
  if (!doc) return null;

  // Try to write to local JSON for fallback asynchronously
  readInvestors().then(writeInvestors).catch(() => {});

  return {
    id: doc.id,
    title: doc.title,
    type: doc.type as InvestorFileType,
    parent: doc.parent || '',
    files: doc.files.map((f: any) => ({
      id: f.id,
      originalName: f.originalName,
      storedName: f.storedName,
      url: f.url,
      mimeType: f.mimeType,
      size: f.size
    })),
    updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString()
  };
}

export async function deleteInvestor(id: string): Promise<boolean> {
  await connectToDatabase();
  const doc = await InvestorModel.findOne({ id });
  if (!doc) return false;

  // Delete all file contents associated with this investor from InvestorFileContent
  try {
    const fileNames = doc.files.map((f: any) => f.storedName);
    if (fileNames.length > 0) {
      await InvestorFileContentModel.deleteMany({ filename: { $in: fileNames } });
    }
  } catch (err) {
    console.error('Failed to delete file contents from MongoDB:', err);
  }

  // Delete physical files if writable (will fail silently on Vercel)
  const dir = path.join(UPLOAD_DIR, id);
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch {}

  await InvestorModel.deleteOne({ id });

  // Try to write to local JSON for fallback asynchronously
  readInvestors().then(writeInvestors).catch(() => {});

  return true;
}

export async function addFileToInvestor(
  investorId: string,
  file: File
): Promise<{ investor: Investor; file: InvestorFile } | { error: string }> {
  await connectToDatabase();
  const doc = await InvestorModel.findOne({ id: investorId });
  if (!doc) return { error: 'Investor not found' };

  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) return { error: 'File exceeds 50MB limit' };

  const ext = path.extname(file.name).toLowerCase();
  const extOk =
    doc.type === 'pdf'
      ? ext === '.pdf'
      : ['.mp3', '.wav', '.m4a', '.ogg', '.webm', '.aac'].includes(ext);

  if (!isAllowedMime(doc.type as InvestorFileType, file.type) && !extOk) {
    return {
      error:
        doc.type === 'pdf'
          ? 'Only PDF files are allowed for this investor'
          : 'Only audio files are allowed for this investor',
    };
  }

  const fileExt = ext || (doc.type === 'pdf' ? '.pdf' : '.mp3');
  const storedName = `${randomUUID()}${fileExt}`;
  
  const buffer = Buffer.from(await file.arrayBuffer());

  // Save raw binary file content to MongoDB
  try {
    await InvestorFileContentModel.create({
      filename: storedName,
      data: buffer,
      mimeType: file.type || (doc.type === 'pdf' ? 'application/pdf' : 'audio/mpeg')
    });
  } catch (err: any) {
    console.error('Failed to write file to MongoDB:', err);
    return { error: 'Failed to upload file to database: ' + err.message };
  }

  // Also try writing to filesystem (will fail silently on Vercel but succeed on local/VPS)
  try {
    const dir = await ensureUploadDir(investorId);
    await fs.writeFile(path.join(dir, storedName), buffer);
  } catch (err) {
    console.warn('Silent warning: Failed to write file to local filesystem:', err);
  }

  const stored: InvestorFile = {
    id: randomUUID(),
    originalName: file.name,
    storedName,
    url: `/uploads/investors/${investorId}/${storedName}`,
    mimeType: file.type || (doc.type === 'pdf' ? 'application/pdf' : 'audio/mpeg'),
    size: file.size,
  };

  doc.files.push(stored);
  doc.updatedAt = new Date().toISOString();
  await doc.save();

  // Try to write to local JSON for fallback asynchronously
  readInvestors().then(writeInvestors).catch(() => {});

  const updatedInvestor: Investor = {
    id: doc.id,
    title: doc.title,
    type: doc.type as InvestorFileType,
    parent: doc.parent || '',
    files: doc.files.map((f: any) => ({
      id: f.id,
      originalName: f.originalName,
      storedName: f.storedName,
      url: f.url,
      mimeType: f.mimeType,
      size: f.size
    })),
    updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString()
  };

  return { investor: updatedInvestor, file: stored };
}

export async function removeFileFromInvestor(
  investorId: string,
  fileId: string
): Promise<Investor | null> {
  await connectToDatabase();
  const doc = await InvestorModel.findOne({ id: investorId });
  if (!doc) return null;

  const file = doc.files.find((f: any) => f.id === fileId);
  if (!file) {
    return {
      id: doc.id,
      title: doc.title,
      type: doc.type as InvestorFileType,
      parent: doc.parent || '',
      files: doc.files.map((f: any) => ({
        id: f.id,
        originalName: f.originalName,
        storedName: f.storedName,
        url: f.url,
        mimeType: f.mimeType,
        size: f.size
      })),
      updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString()
    };
  }

  // Remove raw file data from MongoDB
  try {
    await InvestorFileContentModel.deleteOne({ filename: file.storedName });
  } catch (err) {
    console.error('Failed to delete file from MongoDB:', err);
  }

  // Try to remove from filesystem (ignores EROFS / ENOENT silently)
  const filePath = path.join(UPLOAD_DIR, investorId, file.storedName);
  try {
    await fs.rm(filePath, { force: true });
  } catch (err) {
    console.warn(`Failed to delete physical file ${filePath}:`, err);
  }

  doc.files = doc.files.filter((f: any) => f.id !== fileId);
  doc.updatedAt = new Date().toISOString();
  await doc.save();

  // Try to write to local JSON for fallback asynchronously
  readInvestors().then(writeInvestors).catch(() => {});

  return {
    id: doc.id,
    title: doc.title,
    type: doc.type as InvestorFileType,
    parent: doc.parent || '',
    files: doc.files.map((f: any) => ({
      id: f.id,
      originalName: f.originalName,
      storedName: f.storedName,
      url: f.url,
      mimeType: f.mimeType,
      size: f.size
    })),
    updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString()
  };
}
