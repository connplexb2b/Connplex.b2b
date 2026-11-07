import { NextResponse } from 'next/server';
import { getInvestor, addFileToInvestor } from '@/lib/admin-investors';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  try {
    const { id } = await params;

    const investor = await getInvestor(id);
    if (!investor) {
      return NextResponse.json({ error: 'Investor section not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const title = formData.get('title') ? String(formData.get('title')).trim() : undefined;

    if (!file || typeof (file as any).name !== 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const result = await addFileToInvestor(id, file as any, title);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      investor: result.investor,
      file: result.file,
      success: true
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
