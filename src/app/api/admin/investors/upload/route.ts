import { NextResponse } from 'next/server';
import {
  getInvestor,
  getOrCreateSection,
  addFileToInvestor,
} from '@/lib/admin-investors';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  try {
    const formData = await request.formData();
    const sectionId = formData.get('sectionId') ? String(formData.get('sectionId')).trim() : '';
    const sectionTitle = formData.get('sectionTitle') ? String(formData.get('sectionTitle')).trim() : '';
    const parent = formData.get('parent') ? String(formData.get('parent')).trim() : '';
    const title = formData.get('title') ? String(formData.get('title')).trim() : '';
    const file = formData.get('file');

    if (!file || typeof (file as any).name !== 'string') {
      return NextResponse.json({ error: 'Please select a document file (.pdf or audio)' }, { status: 400 });
    }

    if (!sectionId && !sectionTitle) {
      return NextResponse.json({ error: 'Please choose or enter a section for the document' }, { status: 400 });
    }

    let targetInvestor = null;
    if (sectionId) {
      targetInvestor = await getInvestor(sectionId);
    }

    if (!targetInvestor && sectionTitle) {
      targetInvestor = await getOrCreateSection(sectionTitle, parent);
    }

    if (!targetInvestor) {
      return NextResponse.json({ error: 'Failed to locate or create investor section' }, { status: 404 });
    }

    const docTitle = title || (file as any).name.replace(/\.pdf$/i, '').replace(/\.mp3$/i, '').trim();

    const result = await addFileToInvestor(targetInvestor.id, file as any, docTitle);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      investor: result.investor,
      file: result.file,
      message: `Document "${docTitle}" uploaded successfully to "${targetInvestor.title}".`
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error in investor document upload API:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
