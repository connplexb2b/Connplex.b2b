import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { InvestorFileContent } from '@/models/InvestorFileContent';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    if (!pathSegments || pathSegments.length === 0) {
      return NextResponse.json({ error: 'File path required' }, { status: 400 });
    }

    const filename = pathSegments[pathSegments.length - 1];
    const decodedFilename = decodeURIComponent(filename);

    // 1. Try local filesystem if present (e.g. build-time public files or VPS storage)
    try {
      const localPath = path.join(process.cwd(), 'public', 'uploads', ...pathSegments);
      if (fs.existsSync(localPath)) {
        const fileBuffer = fs.readFileSync(localPath);
        const ext = path.extname(filename).toLowerCase();
        let mimeType = 'application/pdf';
        if (ext === '.mp3') mimeType = 'audio/mpeg';
        else if (ext === '.wav') mimeType = 'audio/wav';
        else if (ext === '.m4a') mimeType = 'audio/mp4';
        else if (ext === '.png') mimeType = 'image/png';
        else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';

        return new Response(fileBuffer, {
          status: 200,
          headers: {
            'Content-Type': mimeType,
            'Content-Disposition': `inline; filename="${encodeURIComponent(decodedFilename)}"`,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    } catch (fsErr) {
      // Ignore filesystem errors and proceed to database fallback
    }

    // 2. Fetch binary stream from MongoDB (InvestorFileContent)
    await connectToDatabase();

    const lookupFilenames = [
      filename,
      decodedFilename,
      decodedFilename.replace(/\s+/g, ' ').trim(),
      decodedFilename.toLowerCase(),
    ];

    let fileDoc = await InvestorFileContent.findOne({
      filename: { $in: lookupFilenames }
    });

    if (!fileDoc) {
      // Case-insensitive regex fallback
      const escaped = decodedFilename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      fileDoc = await InvestorFileContent.findOne({
        filename: { $regex: new RegExp(`^${escaped}$`, 'i') }
      });
    }

    if (!fileDoc && filename.includes('-')) {
      // Also try storedName match if the requested path contains a UUID or timestamp
      fileDoc = await InvestorFileContent.findOne({
        filename: filename
      });
    }

    if (fileDoc && fileDoc.data) {
      const ext = path.extname(decodedFilename).toLowerCase();
      let mimeType = fileDoc.mimeType;
      if (!mimeType) {
        if (ext === '.pdf') mimeType = 'application/pdf';
        else if (ext === '.mp3') mimeType = 'audio/mpeg';
        else if (ext === '.wav') mimeType = 'audio/wav';
        else mimeType = 'application/octet-stream';
      }

      return new Response(fileDoc.data, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Content-Disposition': `inline; filename="${encodeURIComponent(decodedFilename)}"`,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  } catch (error: any) {
    console.error('Error serving file from /uploads route:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
