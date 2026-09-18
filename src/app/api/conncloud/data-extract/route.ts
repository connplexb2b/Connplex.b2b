import { NextRequest, NextResponse } from 'next/server';
import { 
  EXTRACTION_CATEGORIES_SPEC, 
  getAllExtractionSpecs, 
  getExtractionSpecByCategory, 
  extractAllCategoriesData 
} from '@/lib/dataExtractionEngine';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryParam = searchParams.get('category');
    const cinemaId = searchParams.get('cinemaId') || 'c5';
    const dateRange = searchParams.get('dateRange') || 'Month-to-Date';
    const includeData = searchParams.get('includeData') !== 'false';

    if (categoryParam) {
      const spec = getExtractionSpecByCategory(categoryParam);
      if (!spec) {
        return NextResponse.json({
          Status: '0',
          msg: `Category "${categoryParam}" not found in 21-module extraction master matrix.`
        }, { status: 404 });
      }

      return NextResponse.json({
        Status: '1',
        cinemaId,
        dateRange,
        category: {
          sno: spec.sno,
          category: spec.category,
          slug: spec.slug,
          sourceSummary: spec.sourceSummary,
          fetchingOrigin: spec.fetchingOrigin,
          status: spec.status,
          features: spec.features,
          extractedData: includeData ? spec.extractData(cinemaId, dateRange) : undefined,
          extractedAt: new Date().toISOString()
        }
      });
    }

    // Return full 21 categories matrix
    const categoriesData = includeData
      ? extractAllCategoriesData(cinemaId, dateRange)
      : getAllExtractionSpecs().map(spec => ({
          sno: spec.sno,
          category: spec.category,
          slug: spec.slug,
          sourceSummary: spec.sourceSummary,
          fetchingOrigin: spec.fetchingOrigin,
          status: spec.status,
          featureCount: spec.features.length,
          features: spec.features
        }));

    return NextResponse.json({
      Status: '1',
      msg: 'Successfully extracted 21-category telemetry master matrix',
      totalCategories: categoriesData.length,
      cinemaId,
      dateRange,
      categories: categoriesData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      Status: '0',
      msg: 'Failed to extract data matrix',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { category, cinemaId = 'c5', dateRange = 'Month-to-Date' } = body;

    if (category) {
      const spec = getExtractionSpecByCategory(category);
      if (!spec) {
        return NextResponse.json({
          Status: '0',
          msg: `Category "${category}" not found.`
        }, { status: 404 });
      }

      const extracted = spec.extractData(cinemaId, dateRange);
      return NextResponse.json({
        Status: '1',
        msg: `Data extracted for Category ${spec.sno}: ${spec.category}`,
        category: spec.category,
        slug: spec.slug,
        cinemaId,
        dateRange,
        sourceSummary: spec.sourceSummary,
        fetchingOrigin: spec.fetchingOrigin,
        extractedData: extracted,
        extractedAt: new Date().toISOString()
      });
    }

    const allExtracted = extractAllCategoriesData(cinemaId, dateRange);
    return NextResponse.json({
      Status: '1',
      msg: 'Bulk sync completed across all 21 categories',
      totalCategories: allExtracted.length,
      cinemaId,
      dateRange,
      categories: allExtracted,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      Status: '0',
      msg: 'Extraction execution failed',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
