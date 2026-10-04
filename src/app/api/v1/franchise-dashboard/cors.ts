import { NextResponse } from 'next/server';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-role, x-cinema-id, x-franchise-code, x-user-email',
};

export function handleOptions() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export function jsonResponse(data: any, status = 200) {
  return NextResponse.json(data, { status, headers: corsHeaders });
}
