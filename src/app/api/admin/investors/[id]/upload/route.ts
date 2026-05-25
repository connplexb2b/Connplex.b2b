import { NextResponse } from 'next/server';
import { getInvestor, addFileToInvestor } from '@/lib/admin-investors';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  const { id } = await params;

  const investor = await getInvestor(id);
  if (!investor) {
    return NextResponse.json({ error: 'Investor not found' }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const result = await addFileToInvestor(id, file);
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.investor);
}
