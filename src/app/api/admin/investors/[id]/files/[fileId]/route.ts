import { NextResponse } from 'next/server';
import { removeFileFromInvestor, updateInvestorFileTitle } from '@/lib/admin-investors';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  try {
    const { id, fileId } = await params;

    const investor = await removeFileFromInvestor(id, fileId);
    if (!investor) {
      return NextResponse.json({ error: 'Investor section not found' }, { status: 404 });
    }

    return NextResponse.json(investor);
  } catch (error: any) {
    console.error('Error deleting investor file:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  try {
    const { id, fileId } = await params;
    const body = await request.json().catch(() => ({}));
    const title = typeof body.title === 'string' ? body.title.trim() : '';

    if (!title) {
      return NextResponse.json({ error: 'Document name cannot be empty' }, { status: 400 });
    }

    const result = await updateInvestorFileTitle(id, fileId, title);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      investor: result.investor,
      file: result.file
    });
  } catch (error: any) {
    console.error('Error updating document name:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string; fileId: string }> }
) {
  return PATCH(request, context);
}
