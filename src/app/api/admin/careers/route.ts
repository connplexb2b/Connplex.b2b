import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse();
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '15', 10);
    const search = (searchParams.get('search') || '').trim();
    const position = (searchParams.get('position') || 'all').trim();
    const status = (searchParams.get('status') || 'all').trim();

    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database not connected');

    const col = db.collection('careerapplications');

    // Build query
    const query: Record<string, any> = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
        { experience: { $regex: search, $options: 'i' } },
      ];
    }

    if (position && position !== 'all') {
      query.position = { $regex: `^${position}$`, $options: 'i' };
    }

    if (status && status !== 'all') {
      if (status === 'New') {
        query.$or = [{ status: 'New' }, { status: { $exists: false } }, { status: '' }];
      } else {
        query.status = status;
      }
    }

    const total = await col.countDocuments(query);
    const applications = await col
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Aggregated stats
    const allTotal = await col.countDocuments();
    const newCount = await col.countDocuments({
      $or: [{ status: 'New' }, { status: { $exists: false } }, { status: '' }],
    });
    const shortlistedCount = await col.countDocuments({ status: 'Shortlisted' });
    const inReviewCount = await col.countDocuments({ status: 'In Review' });
    const hiredCount = await col.countDocuments({ status: 'Hired' });
    const rejectedCount = await col.countDocuments({ status: 'Rejected' });

    // Distinct positions
    const distinctPositions = await col.distinct('position');

    return NextResponse.json({
      applications,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit) || 1,
      stats: {
        total: allTotal,
        new: newCount,
        inReview: inReviewCount,
        shortlisted: shortlistedCount,
        hired: hiredCount,
        rejected: rejectedCount,
        positions: distinctPositions,
      },
    });
  } catch (err: any) {
    console.error('Failed to fetch career applications:', err);
    return NextResponse.json(
      {
        applications: [],
        total: 0,
        page: 1,
        limit: 15,
        pages: 1,
        stats: { total: 0, new: 0, inReview: 0, shortlisted: 0, hired: 0, rejected: 0, positions: [] },
        error: err.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database not connected');

    let queryId: any;
    try {
      queryId = new ObjectId(id);
    } catch {
      queryId = id;
    }

    const updateFields: Record<string, any> = { updatedAt: new Date() };
    if (status !== undefined) updateFields.status = status;
    if (notes !== undefined) updateFields.notes = notes;

    const result = await db.collection('careerapplications').updateOne(
      { _id: queryId },
      { $set: updateFields }
    );

    return NextResponse.json({
      success: true,
      message: 'Application updated successfully',
      result,
    });
  } catch (err: any) {
    console.error('Failed to update career application:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse();
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database not connected');

    let queryId: any;
    try {
      queryId = new ObjectId(id);
    } catch {
      queryId = id;
    }

    const result = await db.collection('careerapplications').deleteOne({ _id: queryId });

    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully',
      result,
    });
  } catch (err: any) {
    console.error('Failed to delete career application:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
