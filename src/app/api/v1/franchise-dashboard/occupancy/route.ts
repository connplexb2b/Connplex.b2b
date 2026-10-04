import { NextRequest } from 'next/server';
import { FranchiseDashboardService } from '@/services/FranchiseDashboardService';
import { resolveDashboardAuth } from '@/lib/dashboardAuth';
import { handleOptions, jsonResponse } from '../cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  try {
    const auth = resolveDashboardAuth(req);
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') || undefined;

    const data = await FranchiseDashboardService.getOccupancy(auth.effectiveFranchiseCode, date);
    return jsonResponse({
      status: 200,
      userRole: auth.role,
      scopedFranchise: auth.effectiveFranchiseCode,
      data,
    });
  } catch (err: any) {
    return jsonResponse({ status: 500, message: err.message }, 500);
  }
}
