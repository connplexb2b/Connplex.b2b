import { NextResponse } from 'next/server';
import { readInvestors } from '@/lib/admin-investors';

export async function GET() {
  try {
    const investors = await readInvestors();
    
    // Group investors by parent category
    const grouped = new Map<string, any[]>();
    for (const inv of investors) {
      const child = {
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
      if (!grouped.has(inv.parent)) {
        grouped.set(inv.parent, []);
      }
      grouped.get(inv.parent)!.push(child);
    }

    const data = Array.from(grouped.entries()).map(([parent, children]) => ({
      parent,
      children
    }));

    return NextResponse.json({
      status: 200,
      data: data
    });
  } catch (err: any) {
    return NextResponse.json({ status: 500, error: err.message });
  }
}
