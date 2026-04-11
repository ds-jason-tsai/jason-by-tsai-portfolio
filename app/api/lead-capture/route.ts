import { NextResponse } from 'next/server';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbxOpyrpOH5ba5m724S-nsNOc2mMNFEsGQ05AQFpjekWit6qumIr21QJ6fjkOThrqqKV/exec';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Forward to Google Apps Script
    console.log('[Lead Capture] Sending data to GAS:', data.email);
    
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        name: data.name || 'Anonymous',
        project: data.project || 'Portfolio Visit',
        lang: data.lang || 'zh',
        source: 'portfolio_lead_gen'
      }),
    });

    const responseText = await response.text();
    console.log('[Lead Capture] GAS Response Status:', response.status);
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error('[Lead Capture] GAS returned non-JSON response:', responseText.substring(0, 200));
      throw new Error('Invalid response from data store (likely a permission or deployment issue).');
    }

    if (result.result === 'success') {
      console.log('[Lead Capture] Success!');
      return NextResponse.json({ success: true });
    } else {
      console.error('[Lead Capture] GAS reported error:', result.message);
      throw new Error(result.message || 'Data store failed to save.');
    }

  } catch (err: any) {
    console.error('[Lead Capture API Error]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
