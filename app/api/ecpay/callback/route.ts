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

/** 請替換成您新的 GAS Web App 網址 */
const GAS_URL_ECPAY = process.env.GAS_URL_ECPAY || '請將網址設定在環境變數或直接貼在這裡';

export async function POST(request: Request) {
  try {
    // 綠界是以 application/x-www-form-urlencoded 傳送
    const textData = await request.text();
    const params = new URLSearchParams(textData);
    
    // 轉換成一般 Object 並找出 CheckMacValue
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

    // 驗證檢查碼
    const calculatedMac = generateCheckMacValue(verifyData, hashKey, hashIV);

    if (calculatedMac !== checkMacValueOriginal) {
      console.error('[ECPay Callback Mismatch Debug] ====================');
      console.error('TextData from ECPay:', textData);
      console.error('Parsed Data:', JSON.stringify(data));
      console.error('VerifyData:', JSON.stringify(verifyData));
      console.error('HashKey length:', hashKey.length, 'HashIV length:', hashIV.length);
      console.error('Expected CheckMacValue:', checkMacValueOriginal);
      console.error('Calculated CheckMacValue:', calculatedMac);
      console.error('===================================================');
      return new NextResponse('0|CheckMacValue Error', { status: 400 });
    }

    // 驗證成功，判斷是否付款成功 (RtnCode === '1' 代表成功)
    if (data.RtnCode === '1') {
      console.log(`[ECPay Callback] Payment Success Background Ping Received! Order: ${data.MerchantTradeNo}`);
      // 備註：已經將寄信與 Google Sheet 同步的功能移至 /api/ecpay/result (前景同步)，避免背景推播造成通知重複。
    } else {
      console.log(`[ECPay Callback] Payment Failed or Pending. RtnCode: ${data.RtnCode}, Msg: ${data.RtnMsg}`);
    }

    // 必須回傳 1|OK 給綠界，否則他們會一直重試發送
    return new NextResponse('1|OK', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });

  } catch (err: any) {
    console.error('[ECPay Callback API Error]', err.message);
    return new NextResponse('0|Internal Server Error', { status: 500 });
  }
}
