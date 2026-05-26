import { NextResponse } from 'next/server';
import {
  deleteMediaEntry,
  getMediaEntry,
  updateMediaEntry,
  type MediaFileType,
} from '@/lib/admin-media';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  const { id } = await context.params;
  const entry = await getMediaEntry(id);
  if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(entry);
}

export async function PUT(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));

  const data: { title?: string; type?: MediaFileType; parent?: string } = {};
  if (typeof body.title === 'string') data.title = body.title;
  if (body.type === 'pdf' || body.type === 'audio') data.type = body.type;
  if (typeof body.parent === 'string') data.parent = body.parent;

  const entry = await updateMediaEntry(id, data);
  if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(entry);
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  const { id } = await context.params;
  const ok = await deleteMediaEntry(id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
