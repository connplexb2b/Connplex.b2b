import { NextRequest } from 'next/server';
import { FranchiseDashboardService } from '@/services/FranchiseDashboardService';
import { handleOptions, jsonResponse } from '../cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  try {
    const data = await FranchiseDashboardService.getSyncStatus();
    return jsonResponse({
      status: 200,
      data,
    });
  } catch (err: any) {
    return jsonResponse({ status: 500, message: err.message }, 500);
  }
}
