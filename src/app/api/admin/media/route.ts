import { NextResponse } from 'next/server';
import {
  addFileToEntry,
  createMediaEntry,
  readMediaEntries,
  type MediaFileType,
} from '@/lib/admin-media';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  const entries = await readMediaEntries();
  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();

  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const title = String(formData.get('title') || '').trim();
    const type = String(formData.get('type') || 'pdf') as MediaFileType;
    const parent = String(formData.get('parent') || '').trim();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (type !== 'pdf' && type !== 'audio') {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    const entry = await createMediaEntry({ title, type, parent });
    const files = formData.getAll('files');

    for (const item of files) {
      if (item instanceof File && item.size > 0) {
        const result = await addFileToEntry(entry.id, item);
        if ('error' in result) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
      }
    }

    const entries = await readMediaEntries();
    const updated = entries.find((e) => e.id === entry.id);
    return NextResponse.json(updated ?? entry, { status: 201 });
  }

  const body = await request.json().catch(() => ({}));
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const type = body.type === 'audio' ? 'audio' : 'pdf';
  const parent = typeof body.parent === 'string' ? body.parent.trim() : '';

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const entry = await createMediaEntry({ title, type, parent });
  return NextResponse.json(entry, { status: 201 });
}
