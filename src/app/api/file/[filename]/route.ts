import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  // Extract and sanitize filename to prevent directory traversal
  const { filename: unsafeFilename } = await params;
  const filename = path.basename(unsafeFilename);
  
  let fileBuffer: Buffer | null = null;

  // 1. Direct search in public/uploads/
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const directPath = path.join(uploadsDir, filename);
  try {
    fileBuffer = await fs.readFile(directPath);
  } catch {}

  // 2. Direct search in public/uploads/investors/ (if exists as file)
  if (!fileBuffer) {
    const investorsDir = path.join(process.cwd(), 'public', 'uploads', 'investors');
    const directInvestorPath = path.join(investorsDir, filename);
    try {
      fileBuffer = await fs.readFile(directInvestorPath);
    } catch {}
  }

  // 3. Search in subdirectories of public/uploads/investors/
  if (!fileBuffer) {
    const investorsDir = path.join(process.cwd(), 'public', 'uploads', 'investors');
    try {
      const subdirs = await fs.readdir(investorsDir);
      for (const subdir of subdirs) {
        // Skip dotfiles/directories
        if (subdir.startsWith('.')) continue;
        const checkPath = path.join(investorsDir, subdir, filename);
        try {
          fileBuffer = await fs.readFile(checkPath);
          if (fileBuffer) break;
        } catch {}
      }
    } catch {}
  }

  if (!fileBuffer) {
    return new NextResponse('File not found', { status: 404 });
  }

  const headers = new Headers();
  const lowerName = filename.toLowerCase();
  if (lowerName.endsWith('.pdf')) {
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', 'inline');
  } else if (lowerName.endsWith('.png')) {
    headers.set('Content-Type', 'image/png');
  } else if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) {
    headers.set('Content-Type', 'image/jpeg');
  } else if (lowerName.endsWith('.webp')) {
    headers.set('Content-Type', 'image/webp');
  } else if (lowerName.endsWith('.gif')) {
    headers.set('Content-Type', 'image/gif');
  } else {
    headers.set('Content-Type', 'application/octet-stream');
  }

  return new NextResponse(fileBuffer as any, {
    status: 200,
    headers: headers,
  });
}
