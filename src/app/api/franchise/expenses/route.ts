import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import FranchiseExpense from '@/models/FranchiseExpense';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const cinemaId = searchParams.get('cinemaId');
    const status = searchParams.get('status');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');

    const query: Record<string, any> = {};
    if (cinemaId && cinemaId !== 'all') {
      // Map 'c5' or 'Ahilyanagar' or 'CN01'
      query.cinemaId = { $in: [cinemaId, 'c5', 'CN01', 'Ahilyanagar'] };
    }
    if (status && status !== 'all') {
      query.status = status;
    }
    if (fromDate && toDate) {
      query.date = { $gte: fromDate, $lte: toDate };
    } else if (fromDate) {
      query.date = { $gte: fromDate };
    }

    const expenses = await FranchiseExpense.find(query).sort({ date: -1, createdAt: -1 }).lean();

    const totalExpense = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
    const totalTaxPaid = expenses.reduce((acc, e) => acc + (e.tax || 0), 0);
    const approvedExpense = expenses.filter(e => e.status === 'Approved' || e.status === 'Paid').reduce((acc, e) => acc + (e.amount || 0), 0);
    const pendingExpense = expenses.filter(e => e.status === 'Pending').reduce((acc, e) => acc + (e.amount || 0), 0);

    return NextResponse.json(
      {
        success: true,
        count: expenses.length,
        summary: {
          totalExpense,
          totalTaxPaid,
          approvedExpense,
          pendingExpense,
        },
        expenses,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch expenses' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const {
      cinemaId = 'c5',
      title,
      category,
      vendor,
      amount,
      tax,
      gstRate = 18,
      date,
      attachment,
      description,
      createdBy = 'Franchise Manager',
    } = body;

    if (!vendor || !amount || !category) {
      return NextResponse.json(
        { success: false, error: 'Vendor, amount, and category are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const amtNum = parseFloat(amount);
    const gstRateNum = parseFloat(gstRate);
    const taxNum = tax !== undefined ? parseFloat(tax) : Math.round((amtNum * gstRateNum) / 100);

    const expenseCount = await FranchiseExpense.countDocuments();
    const expenseId = `EXP-${String(10000 + expenseCount + 1)}`;

    const newExpense = await FranchiseExpense.create({
      cinemaId,
      expenseId,
      title: title || `${category} - ${vendor}`,
      category,
      vendor,
      amount: amtNum,
      tax: taxNum,
      gstRate: gstRateNum,
      date: date || new Date().toISOString().split('T')[0],
      status: 'Pending',
      attachment: attachment || '',
      description: description || '',
      createdBy,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Expense created successfully and queued for approval',
        expense: newExpense,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create expense' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { expenseId, status, approver } = body;

    if (!expenseId || !status) {
      return NextResponse.json(
        { success: false, error: 'expenseId and status are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const updateData: Record<string, any> = {
      status,
    };

    if (status === 'Approved' || status === 'Paid') {
      updateData.approver = approver || 'Franchise Partner';
      updateData.approvedAt = new Date();
    }

    const updated = await FranchiseExpense.findOneAndUpdate(
      { expenseId },
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Expense not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Expense ${expenseId} status updated to ${status}`,
        expense: updated,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Error updating expense:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update expense' },
      { status: 500, headers: corsHeaders }
    );
  }
}
