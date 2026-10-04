import { NextRequest } from 'next/server';
import { FranchiseDashboardService } from '@/services/FranchiseDashboardService';
import { resolveDashboardAuth } from '@/lib/dashboardAuth';
import { handleOptions, jsonResponse } from '../cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const auth = resolveDashboardAuth(req);
    if (auth.role !== 'CORPORATE_ADMIN') {
      return jsonResponse(
        {
          status: 403,
          message: 'Access Denied: Only Connplex Corporate Administrators can trigger manual synchronization.',
        },
        403
      );
    }

    const body = await req.json().catch(() => ({}));
    const data = await FranchiseDashboardService.triggerManualSync({
      franchiseCode: body.franchiseCode || undefined,
      startDate: body.startDate || undefined,
      endDate: body.endDate || undefined,
    });

    return jsonResponse({
      status: 200,
      data,
    });
  } catch (err: any) {
    return jsonResponse({ status: 500, message: err.message }, 500);
  }
}
