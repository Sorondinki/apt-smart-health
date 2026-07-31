import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json({ message: 'Reference is required' }, { status: 400 });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    // Tabbatar da Biyan Kudi daga Server na Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.status && data.data.status === 'success') {
      return NextResponse.json({ success: true, data: data.data });
    } else {
      return NextResponse.json({ success: false, message: 'Transaction verification failed' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
