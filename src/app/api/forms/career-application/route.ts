import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.fullName || !body.email || !body.phone) {
      return NextResponse.json(
        { success: false, message: 'Full name, email, and phone number are required.' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection failed');
    }

    // Insert into careerapplications collection
    const result = await db.collection('careerapplications').insertOne({
      fullName: String(body.fullName).trim(),
      email: String(body.email).trim().toLowerCase(),
      phone: String(body.phone).trim(),
      position: String(body.position || 'General Application').trim(),
      experience: String(body.experience || '').trim(),
      coverLetter: String(body.coverLetter || '').trim(),
      cvUrl: String(body.cvUrl || '').trim(),
      status: 'New',
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Career application submitted successfully',
        data: result,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Failed to store career application:', err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
