import { NextResponse } from 'next/server';
import { removeFileFromEntry } from '@/lib/admin-media';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

type RouteContext = { params: Promise<{ id: string; fileId: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  const { id, fileId } = await context.params;
  const entry = await removeFileFromEntry(id, fileId);
  if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(entry);
}
