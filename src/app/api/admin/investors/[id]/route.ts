import { NextResponse } from 'next/server';
import {
  getInvestor,
  updateInvestor,
  deleteInvestor,
  addFileToInvestor,
  type InvestorFileType,
} from '@/lib/admin-investors';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  const { id } = await params;
  const investor = await getInvestor(id);
  if (!investor) {
    return NextResponse.json({ error: 'Investor not found' }, { status: 404 });
  }
  return NextResponse.json(investor);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  const title = typeof body.title === 'string' ? body.title.trim() : undefined;
  const type =
    body.type === 'pdf' || body.type === 'audio' ? (body.type as InvestorFileType) : undefined;
  const parent = typeof body.parent === 'string' ? body.parent.trim() : undefined;

  if (title === '') {
    return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
  }

  const investor = await updateInvestor(id, { title, type, parent });
  if (!investor) {
    return NextResponse.json({ error: 'Investor not found' }, { status: 404 });
  }

  return NextResponse.json(investor);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  const { id } = await params;

  const success = await deleteInvestor(id);
  if (!success) {
    return NextResponse.json({ error: 'Investor not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
