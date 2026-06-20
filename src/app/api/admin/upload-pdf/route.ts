import { NextResponse } from 'next/server';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const ext = path.extname(file.name).toLowerCase() || '.pdf';
    const storedName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    
    await fs.writeFile(path.join(UPLOAD_DIR, storedName), buffer);

    const fileUrl = `https://webadmin.theconnplex.com/api/file/${storedName}`;

    return NextResponse.json({ fileUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
