import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reportId, lang = 'zh' } = body;

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'twd',
            product_data: {
              name: reportId === 'report_1' ? '完整市場分析報告 (進階版)' : '精選數據資料集',
              description: '這是一份由 Jason Tsai 製作的獨家分析報告。購買後將可下載。',
            },
            unit_amount: 500 * 100, // 500 TWD
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/success?session_id={CHECKOUT_SESSION_ID}&product=${reportId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/services`,
      metadata: {
        reportId: reportId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}
