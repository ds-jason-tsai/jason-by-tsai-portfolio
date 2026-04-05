import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key', {
  apiVersion: '2025-02-24.acacia',
});

// Map reportId -> { name, price (in TWD), description, driveUrl }
// driveUrl is only used if you want server-side redirect — for now we embed it in success page
const REPORT_CATALOG: Record<string, { name: string; price: number; description: string }> = {
  salesforce_se: {
    name: 'Case Study: Salesforce Solution Engineer Pitch',
    price: 498,
    description: 'C-level 專業簡報。涵蓋執行摘要、企業痛點、解決方案、技術架構及 Next Step。',
  },
  report_1: {
    name: '完整市場分析報告 (進階版)',
    price: 500,
    description: '由 Jason Tsai 製作的獨家分析報告。購買後將可下載。',
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reportId, lang = 'zh', price: customPrice, productName: customName } = body;

    const catalog = REPORT_CATALOG[reportId];
    const name = customName || catalog?.name || '數位分析報告';
    const priceAmount = customPrice || catalog?.price || 500;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'twd',
            product_data: {
              name,
              description: catalog?.description || '購買後將可立即下載。',
            },
            unit_amount: priceAmount * 100, // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/success?session_id={CHECKOUT_SESSION_ID}&product=${reportId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/reports`,
      metadata: {
        reportId,
        lang,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}
