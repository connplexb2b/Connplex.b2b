import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  
  // Search for the file in public/uploads and its subdirectories
  const searchDirs = [
    path.join(process.cwd(), 'public', 'uploads'),
    path.join(process.cwd(), 'public', 'uploads', 'investors'),
  ];
  
  let fileBuffer: Buffer | null = null;
  let filePathFound = '';

  for (const dir of searchDirs) {
    if (dir.endsWith('investors')) {
      try {
        const subdirs = await fs.readdir(dir);
        for (const subdir of subdirs) {
          const checkPath = path.join(dir, subdir, filename);
          try {
            fileBuffer = await fs.readFile(checkPath);
            filePathFound = checkPath;
            break;
          } catch {}
        }
      } catch {}
    } else {
      const checkPath = path.join(dir, filename);
      try {
        fileBuffer = await fs.readFile(checkPath);
        filePathFound = checkPath;
        break;
      } catch {}
    }
    if (fileBuffer) break;
  }

  if (!fileBuffer) {
    return new NextResponse('File not found', { status: 404 });
  }

  const headers = new Headers();
  if (filename.toLowerCase().endsWith('.pdf')) {
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', 'inline');
  } else {
    headers.set('Content-Type', 'application/octet-stream');
  }

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: headers,
  });
}
