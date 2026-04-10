import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * ─────────────────────────────────────────────
 * 綠界金流 (ECPay) AIO 串接方案 - V5 終極相容版
 * ─────────────────────────────────────────────
 */

const ECPAY_PROD_URL  = 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5';
const ECPAY_STAGE_URL = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5';

const REPORT_CATALOG: Record<string, { name: string; price: number }> = {
  salesforce_se: { name: 'Salesforce SE Pitch', price: 498 },
  notebooklm_series: { name: 'NotebookLM Guide', price: 898 },
};

/** 綠界專用 URL Encode (數位顯微鏡校準版) */
function ecpayUrlEncode(str: string): string {
  // 1. 先編碼並轉全小寫
  let encoded = encodeURIComponent(str).toLowerCase();
  
  // 2. 依照綠界規定的 .NET 編碼風格進行「符號代換」
  // 核心邏輯：- _ . ! * ( ) 不需轉碼，其餘依照標準；空格轉 +
  encoded = encoded
    .replace(/%20/g, '+')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/~/g, '%7e')    // 強制編碼波浪號 (JS預設不轉)
    .replace(/'/g, '%27');   // 強制編碼單引號 (JS預設不轉)
    
  return encoded;
}

/** 產生綠界 CheckMacValue (SHA256) */
function generateCheckMacValue(params: Record<string, string>, hashKey: string, hashIV: string): string {
  // 1. 字典序排序
  const sortedKeys = Object.keys(params).sort();
  
  // 2. 組合參數串
  const queryString = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
  
  // 3. 夾心餅乾組合
  const rawString = `HashKey=${hashKey}&${queryString}&HashIV=${hashIV}`;
  
  // 4. 進行終極 URL Encode
  const encodedString = ecpayUrlEncode(rawString);
  
  // 5. SHA256 雜湊 -> 轉大寫
  const hash = crypto.createHash('sha256').update(encodedString).digest('hex');
  return hash.toUpperCase();
}

/** 產生唯一、不可預測的訂單號 */
function generateOrderNo(): string {
  const ts = Date.now().toString().slice(-10);
  const rand = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `JT${ts}${rand}`.slice(0, 20);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reportId, lang = 'zh', price: customPrice, productName: customName } = body;

    const merchantId = (process.env.ECPAY_MERCHANT_ID || '').trim();
    const hashKey    = (process.env.ECPAY_HASH_KEY || '').trim();
    const hashIV     = (process.env.ECPAY_HASH_IV || '').trim();
    const baseUrl    = (process.env.NEXT_PUBLIC_BASE_URL || 'https://jason-by-tsai-portfolio.vercel.app').trim();

    if (!merchantId || !hashKey || !hashIV) {
      return NextResponse.json({ error: 'ECPay Environment Variables Missing' }, { status: 503 });
    }

    const catalog     = REPORT_CATALOG[reportId];
    const rawName     = customName  || catalog?.name  || 'Report';
    const itemName    = rawName.replace(/[^\w\s]/g, '').slice(0, 50); // 只留字母、底線、空格
    const amount      = customPrice || catalog?.price || 498;
    
    const params: Record<string, string> = {
      MerchantID: merchantId,
      MerchantTradeNo: generateOrderNo(),
      MerchantTradeDate: new Date().toLocaleString('zh-TW', { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/-/g, '/'),
      PaymentType: 'aio',
      TotalAmount: String(amount),
      TradeDesc: 'DigitalInsights', 
      ItemName: itemName || 'Insights',
      ReturnURL: `${baseUrl}/api/ecpay/callback`,
      ChoosePayment: 'Credit', 
      EncryptType: '1', 
      ClientBackURL: `${baseUrl}/${lang}/reports`,
      OrderResultURL: `${baseUrl}/${lang}/success?product=${reportId}`,
    };

    // 計算檢查碼
    const checkMacValue = generateCheckMacValue(params, hashKey, hashIV);
    params['CheckMacValue'] = checkMacValue;

    const finalGateway = merchantId === '2000132' ? ECPAY_STAGE_URL : ECPAY_PROD_URL;

    return NextResponse.json({
      paymentUrl: finalGateway,
      params: params
    });

  } catch (err: any) {
    console.error('[ECPay Error]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
