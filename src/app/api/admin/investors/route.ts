import { NextResponse } from 'next/server';
import {
  addFileToInvestor,
  createInvestor,
  readInvestors,
  type InvestorFileType,
} from '@/lib/admin-investors';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  try {
    const investors = await readInvestors();
    return NextResponse.json(investors);
  } catch (error: any) {
    console.error('Error fetching investors:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();

  try {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const title = String(formData.get('title') || '').trim();
      const type = String(formData.get('type') || 'pdf') as InvestorFileType;
      const parent = String(formData.get('parent') || '').trim();

      if (!title) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      }
      if (type !== 'pdf' && type !== 'audio') {
        return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
      }

      const investor = await createInvestor({ title, type, parent });
      const files = formData.getAll('files');

      for (const item of files) {
        const fileItem = item as any;
        if (fileItem && typeof fileItem.name === 'string' && fileItem.size > 0) {
          const result = await addFileToInvestor(investor.id, fileItem);
          if ('error' in result) {
            return NextResponse.json({ error: result.error }, { status: 400 });
          }
        }
      }

      const investors = await readInvestors();
      const updated = investors.find((e) => e.id === investor.id);
      return NextResponse.json(updated ?? investor, { status: 201 });
    }

    const body = await request.json().catch(() => ({}));
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const type = body.type === 'audio' ? 'audio' : 'pdf';
    const parent = typeof body.parent === 'string' ? body.parent.trim() : '';

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const investor = await createInvestor({ title, type, parent });
    return NextResponse.json(investor, { status: 201 });
  } catch (error: any) {
    console.error('Error creating investor:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
