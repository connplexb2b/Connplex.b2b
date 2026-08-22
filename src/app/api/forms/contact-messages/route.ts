import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Connect to database
    await connectToDatabase();

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection failed');
    }

    // Insert into contactmessages collection
    const result = await db.collection('contactmessages').insertOne({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      state: body.state,
      city: body.city,
      preferredInvestment: body.preferredInvestment || 'N/A',
      preferredCity: body.preferredCity || 'N/A',
      company: body.company || 'N/A',
      businessType: body.businessType || 'N/A',
      hasProperty: body.hasProperty || 'N/A',
      timeframe: body.timeframe || 'N/A',
      message: body.message,
      razorpay_order_id: body.razorpay_order_id,
      razorpay_payment_id: body.razorpay_payment_id,
      razorpay_signature: body.razorpay_signature,
      amountPaid: body.amountPaid,
      paymentStatus: body.paymentStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Message stored successfully',
        data: result,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Failed to store contact message:', err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
