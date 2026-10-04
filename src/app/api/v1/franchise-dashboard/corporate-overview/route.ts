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
    if (auth.role !== 'CORPORATE_ADMIN') {
      return jsonResponse(
        {
          status: 403,
          message: 'Access Denied: Only Connplex Corporate Administrators can access the multi-cinema corporate overview.',
        },
        403
      );
    }

    const data = await FranchiseDashboardService.getCorporateOverview();
    return jsonResponse({
      status: 200,
      userRole: auth.role,
      data,
    });
  } catch (err: any) {
    return jsonResponse({ status: 500, message: err.message }, 500);
  }
}
