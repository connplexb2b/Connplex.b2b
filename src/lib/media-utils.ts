export type MediaFileType = 'pdf' | 'audio';

export interface StoredMediaFile {
  id: string;
  originalName: string;
  storedName: string;
  url: string;
  mimeType: string;
  size: number;
}

export interface MediaEntry {
  id: string;
  title: string;
  type: MediaFileType;
  parent: string;
  files: StoredMediaFile[];
  updatedAt: string;
}

export function getAcceptForType(type: MediaFileType): string {
  return type === 'pdf'
    ? '.pdf,application/pdf'
    : 'audio/*,.mp3,.wav,.m4a,.ogg,.webm,.aac';
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// Investor types
export type InvestorFileType = 'pdf' | 'audio';

export interface InvestorFile {
  id: string;
  originalName: string;
  storedName: string;
  url: string;
  mimeType: string;
  size: number;
}

export interface Investor {
  id: string;
  title: string;
  type: InvestorFileType;
  parent: string;
  files: InvestorFile[];
  updatedAt: string;
}
