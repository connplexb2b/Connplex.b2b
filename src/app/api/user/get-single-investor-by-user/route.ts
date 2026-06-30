import { NextResponse } from 'next/server';
import { readInvestors } from '@/lib/admin-investors';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    if (!title) {
      return NextResponse.json({ status: 400, error: 'Title query parameter is required' });
    }

    const investors = await readInvestors();
    const inv = investors.find(i => i.title.toLowerCase() === title.toLowerCase());
    
    if (!inv) {
      return NextResponse.json({ status: 404, error: 'Investor category not found' });
    }

    const data = {
      _id: inv.id,
      title: inv.title,
      type: inv.type,
      parent: inv.parent,
      investorsPdfs: inv.files.map(f => ({
        _id: f.id,
        originalname: f.originalName,
        fileName: f.storedName,
        mimeType: f.mimeType,
        size: f.size
      })),
      content: ""
    };

    return NextResponse.json({
      status: 200,
      data: data
    });
  } catch (err: any) {
    return NextResponse.json({ status: 500, error: err.message });
  }
}
