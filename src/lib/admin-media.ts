import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { MediaEntry, MediaFileType, StoredMediaFile } from '@/lib/media-utils';

export type { MediaEntry, MediaFileType, StoredMediaFile };
export { formatDate, formatFileSize, getAcceptForType } from '@/lib/media-utils';

const DATA_PATH = path.join(process.cwd(), 'data', 'admin-media.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'admin');

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

export function isAllowedMime(type: MediaFileType, mime: string): boolean {
  if (type === 'pdf') return PDF_MIME.has(mime) || mime === 'application/octet-stream';
  return AUDIO_MIME.has(mime) || mime.startsWith('audio/');
}

export async function ensureUploadDir(entryId: string): Promise<string> {
  const dir = path.join(UPLOAD_DIR, entryId);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export async function readMediaEntries(): Promise<MediaEntry[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw) as MediaEntry[];
  } catch {
    return [];
  }
}

export async function writeMediaEntries(entries: MediaEntry[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  try {
    await fs.chmod(DATA_PATH, 0o666);
  } catch (e) {}
  await fs.writeFile(DATA_PATH, JSON.stringify(entries, null, 2), 'utf-8');
}

export async function getMediaEntry(id: string): Promise<MediaEntry | null> {
  const entries = await readMediaEntries();
  return entries.find((e) => e.id === id) ?? null;
}

export async function createMediaEntry(data: {
  title: string;
  type: MediaFileType;
  parent?: string;
}): Promise<MediaEntry> {
  const entries = await readMediaEntries();
  const entry: MediaEntry = {
    id: randomUUID(),
    title: data.title.trim(),
    type: data.type,
    parent: data.parent?.trim() || '',
    files: [],
    updatedAt: new Date().toISOString(),
  };
  entries.unshift(entry);
  await writeMediaEntries(entries);
  await ensureUploadDir(entry.id);
  return entry;
}

export async function updateMediaEntry(
  id: string,
  data: { title?: string; type?: MediaFileType; parent?: string }
): Promise<MediaEntry | null> {
  const entries = await readMediaEntries();
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) return null;

  const entry = entries[index];
  if (data.title !== undefined) entry.title = data.title.trim();
  if (data.type !== undefined) entry.type = data.type;
  if (data.parent !== undefined) entry.parent = data.parent.trim();
  entry.updatedAt = new Date().toISOString();

  entries[index] = entry;
  await writeMediaEntries(entries);
  return entry;
}

export async function deleteMediaEntry(id: string): Promise<boolean> {
  const entries = await readMediaEntries();
  const entry = entries.find((e) => e.id === id);
  if (!entry) return false;

  const dir = path.join(UPLOAD_DIR, id);
  await fs.rm(dir, { recursive: true, force: true });
  await writeMediaEntries(entries.filter((e) => e.id !== id));
  return true;
}

export async function addFileToEntry(
  entryId: string,
  file: File
): Promise<{ entry: MediaEntry; file: StoredMediaFile } | { error: string }> {
  const entries = await readMediaEntries();
  const index = entries.findIndex((e) => e.id === entryId);
  if (index === -1) return { error: 'Entry not found' };

  const entry = entries[index];
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) return { error: 'File exceeds 50MB limit' };

  const ext = path.extname(file.name).toLowerCase();
  const extOk =
    entry.type === 'pdf'
      ? ext === '.pdf'
      : ['.mp3', '.wav', '.m4a', '.ogg', '.webm', '.aac'].includes(ext);

  if (!isAllowedMime(entry.type, file.type) && !extOk) {
    return {
      error:
        entry.type === 'pdf'
          ? 'Only PDF files are allowed for this entry'
          : 'Only audio files are allowed for this entry',
    };
  }

  const fileExt = ext || (entry.type === 'pdf' ? '.pdf' : '.mp3');
  const storedName = `${randomUUID()}${fileExt}`;
  const dir = await ensureUploadDir(entryId);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, storedName), buffer);

  const stored: StoredMediaFile = {
    id: randomUUID(),
    originalName: file.name,
    storedName,
    url: `/uploads/admin/${entryId}/${storedName}`,
    mimeType: file.type || (entry.type === 'pdf' ? 'application/pdf' : 'audio/mpeg'),
    size: file.size,
  };

  entry.files.push(stored);
  entry.updatedAt = new Date().toISOString();
  entries[index] = entry;
  await writeMediaEntries(entries);

  return { entry, file: stored };
}

export async function removeFileFromEntry(
  entryId: string,
  fileId: string
): Promise<MediaEntry | null> {
  const entries = await readMediaEntries();
  const index = entries.findIndex((e) => e.id === entryId);
  if (index === -1) return null;

  const entry = entries[index];
  const file = entry.files.find((f) => f.id === fileId);
  if (!file) return entry;

  const filePath = path.join(UPLOAD_DIR, entryId, file.storedName);
  await fs.rm(filePath, { force: true });

  entry.files = entry.files.filter((f) => f.id !== fileId);
  entry.updatedAt = new Date().toISOString();
  entries[index] = entry;
  await writeMediaEntries(entries);
  return entry;
}

