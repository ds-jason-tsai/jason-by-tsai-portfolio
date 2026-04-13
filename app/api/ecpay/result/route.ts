import { NextResponse } from 'next/server';
import crypto from 'crypto';

/** 絕對校準版 URL Encode */
function ecpayUrlEncode(str: string): string {
  let encoded = encodeURIComponent(str).toLowerCase();
  encoded = encoded
    .replace(/%20/g, '+')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/~/g, '%7e');
  return encoded;
}

/** 產生符合 ECPay V5 規範的 CheckMacValue */
function generateCheckMacValue(params: Record<string, string>, hashKey: string, hashIV: string): string {
  const sortedKeys = Object.keys(params).sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });
  const queryString = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
  const rawString = `HashKey=${hashKey}&${queryString}&HashIV=${hashIV}`;
  const encodedString = ecpayUrlEncode(rawString);
  const hash = crypto.createHash('sha256').update(encodedString).digest('hex');
  return hash.toUpperCase();
}

/**
 * 這是專門給 ECPay 的 `OrderResultURL` 使用的 API。
 * 當顧客在綠界頁面付款完畢（不論成功或失敗），綠界會把消費者導回這個網址。
 * 我們在這裡攔截 POST 請求，檢查是否有成功付款，再安全地進行 GET 跳轉。
 */
export async function POST(request: Request) {
  try {
    const textData = await request.text();
    const params = new URLSearchParams(textData);
    
    const data: Record<string, string> = {};
    let checkMacValueOriginal = '';
    const verifyData: Record<string, string> = {};

    for (const [key, value] of params.entries()) {
      data[key] = value;
      if (key.toLowerCase() === 'checkmacvalue') {
        checkMacValueOriginal = value;
      } else {
        verifyData[key] = value;
      }
    }

    const hashKey = (process.env.ECPAY_HASH_KEY || '').trim();
    const hashIV = (process.env.ECPAY_HASH_IV || '').trim();
    
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'zh';

    // 驗證檢查碼
    const calculatedMac = generateCheckMacValue(verifyData, hashKey, hashIV);

    if (calculatedMac !== checkMacValueOriginal) {
      console.warn('[ECPay Result] Mac Mismatch (Possible tampering)');
      return NextResponse.redirect(new URL(`/${lang}/reports?error=mac_failed`, request.url), 303);
    }

    const product = data.CustomField1 || '';

    // 付款成功
    if (data.RtnCode === '1') {
      // 為了避免其他人直接輸入 /success 網址就看到內容，我們用 HashKey 對這筆請求簽名
      const timestamp = Date.now().toString();
      const signature = crypto.createHmac('sha256', hashKey).update(`${product}:${timestamp}`).digest('hex');
      
      const successUrl = new URL(`/${lang}/success?product=${product}&t=${timestamp}&sig=${signature}`, request.url);
      return NextResponse.redirect(successUrl, 303);
    } else {
      // 付款失敗 (例如 Apple Pay 授權失敗)
      console.log(`[ECPay Result] Payment failed. RtnCode: ${data.RtnCode}, RtnMsg: ${data.RtnMsg}`);
      const failedUrl = new URL(`/${lang}/reports?error=payment_failed&msg=${encodeURIComponent(data.RtnMsg || '授權失敗')}`, request.url);
      return NextResponse.redirect(failedUrl, 303);
    }
  } catch (err: any) {
    console.error('[ECPay Result API Error]', err.message);
    return NextResponse.redirect(new URL('/zh/reports?error=server_error', request.url), 303);
  }
}
