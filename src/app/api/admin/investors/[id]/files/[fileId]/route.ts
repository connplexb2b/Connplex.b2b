import { NextResponse } from 'next/server';
import { removeFileFromInvestor } from '@/lib/admin-investors';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  const { id, fileId } = await params;

  const investor = await removeFileFromInvestor(id, fileId);
  if (!investor) {
    return NextResponse.json({ error: 'Investor not found' }, { status: 404 });
  }

  return NextResponse.json(investor);
}
