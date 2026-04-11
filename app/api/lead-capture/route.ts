import { NextResponse } from 'next/server';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbxOpyrpOH5ba5m724S-nsNOc2mMNFEsGQ05AQFpjekWit6qumIr21QJ6fjkOThrqqKV/exec';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Forward to Google Apps Script
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        name: data.name || 'Anonymous',
        project: data.project || 'Portfolio Visit',
        lang: data.lang || 'zh',
        source: 'portfolio_lead_gen'
      }),
    });

    const result = await response.json();

    if (result.result === 'success') {
      return NextResponse.json({ success: true });
    } else {
      throw new Error(result.message || 'GAS failed');
    }

  } catch (err: any) {
    console.error('[Lead Capture API Error]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
