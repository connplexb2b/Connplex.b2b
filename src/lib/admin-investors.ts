import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { Investor, InvestorFileType, InvestorFile } from '@/lib/media-utils';

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
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw) as Investor[];
  } catch {
    return [];
  }
}

export async function writeInvestors(investors: Investor[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  try {
    await fs.chmod(DATA_PATH, 0o666);
  } catch (e) {}
  await fs.writeFile(DATA_PATH, JSON.stringify(investors, null, 2), 'utf-8');
}

export async function getInvestor(id: string): Promise<Investor | null> {
  const investors = await readInvestors();
  return investors.find((e) => e.id === id) ?? null;
}

export async function createInvestor(data: {
  title: string;
  type: InvestorFileType;
  parent?: string;
}): Promise<Investor> {
  const investors = await readInvestors();
  const investor: Investor = {
    id: randomUUID(),
    title: data.title.trim(),
    type: data.type,
    parent: data.parent?.trim() || '',
    files: [],
    updatedAt: new Date().toISOString(),
  };
  investors.unshift(investor);
  await writeInvestors(investors);
  await ensureUploadDir(investor.id);
  return investor;
}

export async function updateInvestor(
  id: string,
  data: { title?: string; type?: InvestorFileType; parent?: string }
): Promise<Investor | null> {
  const investors = await readInvestors();
  const index = investors.findIndex((e) => e.id === id);
  if (index === -1) return null;

  const investor = investors[index];
  if (data.title !== undefined) investor.title = data.title.trim();
  if (data.type !== undefined) investor.type = data.type;
  if (data.parent !== undefined) investor.parent = data.parent.trim();
  investor.updatedAt = new Date().toISOString();

  investors[index] = investor;
  await writeInvestors(investors);
  return investor;
}

export async function deleteInvestor(id: string): Promise<boolean> {
  const investors = await readInvestors();
  const investor = investors.find((e) => e.id === id);
  if (!investor) return false;

  const dir = path.join(UPLOAD_DIR, id);
  await fs.rm(dir, { recursive: true, force: true });
  await writeInvestors(investors.filter((e) => e.id !== id));
  return true;
}

export async function addFileToInvestor(
  investorId: string,
  file: File
): Promise<{ investor: Investor; file: InvestorFile } | { error: string }> {
  const investors = await readInvestors();
  const index = investors.findIndex((e) => e.id === investorId);
  if (index === -1) return { error: 'Investor not found' };

  const investor = investors[index];
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) return { error: 'File exceeds 50MB limit' };

  const ext = path.extname(file.name).toLowerCase();
  const extOk =
    investor.type === 'pdf'
      ? ext === '.pdf'
      : ['.mp3', '.wav', '.m4a', '.ogg', '.webm', '.aac'].includes(ext);

  if (!isAllowedMime(investor.type, file.type) && !extOk) {
    return {
      error:
        investor.type === 'pdf'
          ? 'Only PDF files are allowed for this investor'
          : 'Only audio files are allowed for this investor',
    };
  }

  const fileExt = ext || (investor.type === 'pdf' ? '.pdf' : '.mp3');
  const storedName = `${randomUUID()}${fileExt}`;
  const dir = await ensureUploadDir(investorId);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, storedName), buffer);

  const stored: InvestorFile = {
    id: randomUUID(),
    originalName: file.name,
    storedName,
    url: `/uploads/investors/${investorId}/${storedName}`,
    mimeType: file.type || (investor.type === 'pdf' ? 'application/pdf' : 'audio/mpeg'),
    size: file.size,
  };

  investor.files.push(stored);
  investor.updatedAt = new Date().toISOString();
  investors[index] = investor;
  await writeInvestors(investors);

  return { investor, file: stored };
}

export async function removeFileFromInvestor(
  investorId: string,
  fileId: string
): Promise<Investor | null> {
  const investors = await readInvestors();
  const index = investors.findIndex((e) => e.id === investorId);
  if (index === -1) return null;

  const investor = investors[index];
  const file = investor.files.find((f) => f.id === fileId);
  if (!file) return investor;

  const filePath = path.join(UPLOAD_DIR, investorId, file.storedName);
  await fs.rm(filePath, { force: true });

  investor.files = investor.files.filter((f) => f.id !== fileId);
  investor.updatedAt = new Date().toISOString();
  investors[index] = investor;
  await writeInvestors(investors);
  return investor;
}
