import { NextResponse } from 'next/server';
import { removeFileFromEntry } from '@/lib/admin-media';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

type RouteContext = { params: Promise<{ id: string; fileId: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  try {
    const { id, fileId } = await context.params;
    const entry = await removeFileFromEntry(id, fileId);
    if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(entry);
  } catch (error: any) {
    console.error('Error deleting media file:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
