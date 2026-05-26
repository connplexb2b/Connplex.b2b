import { NextResponse } from 'next/server';
import { addFileToEntry } from '@/lib/admin-media';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  const { id } = await context.params;
  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const result = await addFileToEntry(id, file);
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.entry);
}
