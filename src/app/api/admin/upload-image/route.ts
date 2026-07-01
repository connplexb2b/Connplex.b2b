import { NextResponse } from 'next/server';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file is indeed an image
    const isImage = file.type.startsWith('image/') || 
                    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name);
    if (!isImage) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const ext = path.extname(file.name).toLowerCase() || '.png';
    const storedName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    
    await fs.writeFile(path.join(UPLOAD_DIR, storedName), buffer);

    // Return the relative URL which Next.js will resolve from the public directory
    const fileUrl = `/uploads/${storedName}`;

    return NextResponse.json({ fileUrl });
  } catch (err: any) {
    console.error("Image upload API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
