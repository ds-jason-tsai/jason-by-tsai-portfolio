import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * ─────────────────────────────────────────────
 * 綠界金流 (ECPay) AIO 串接方案 - 2024 官方文規對齊版
 * ─────────────────────────────────────────────
 */

const ECPAY_PROD_URL  = 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5';
const ECPAY_STAGE_URL = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5';

const REPORT_CATALOG: Record<string, { name: string; price: number }> = {
  salesforce_se: { name: 'Salesforce SE Pitch', price: 498 },
  notebooklm_series: { name: 'NotebookLM Guide', price: 898 },
};

/** 
 * 絕對校準版 URL Encode 
 * 根據官方開發者文件 (2904) 規範進行代換
 */
function ecpayUrlEncode(str: string): string {
  let encoded = encodeURIComponent(str).toLowerCase();
  
  // 按照官方轉換表要求進行處理
  encoded = encoded
    .replace(/%20/g, '+')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/~/g, '%7e'); // 關鍵：波浪號必須被轉為 %7e (JS不會自動轉)
    
  return encoded;
}

/** 產生符合 ECPay V5 規範的 CheckMacValue */
function generateCheckMacValue(params: Record<string, string>, hashKey: string, hashIV: string): string {
  // 1. 字典序排序 Key
  const sortedKeys = Object.keys(params).sort();
  
  // 2. 組合 QueryString
  const queryString = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
  
  // 3. 夾入密鑰
  const rawString = `HashKey=${hashKey}&${queryString}&HashIV=${hashIV}`;
  
  // 4. 標準 URL Encode -> 小寫
  const encodedString = ecpayUrlEncode(rawString);
  
  // 5. SHA256 -> 大寫
  const hash = crypto.createHash('sha256').update(encodedString).digest('hex');
  return hash.toUpperCase();
}

/** 產生手動格式化的日期 yyyy/MM/dd HH:mm:ss (避開環境差異) */
function getECPayDate(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reportId, lang = 'zh', price: customPrice } = body;

    const merchantId = (process.env.ECPAY_MERCHANT_ID || '').trim();
    const hashKey    = (process.env.ECPAY_HASH_KEY || '').trim();
    const hashIV     = (process.env.ECPAY_HASH_IV || '').trim();
    const baseUrl    = (process.env.NEXT_PUBLIC_BASE_URL || 'https://jason-by-tsai-portfolio.vercel.app').trim();

    if (!merchantId || !hashKey || !hashIV) {
      return NextResponse.json({ error: 'Missing Credentials' }, { status: 503 });
    }

    // 依照 2858 文件，全功能 AIO 必填的所有欄位
    const params: Record<string, string> = {
      MerchantID: merchantId,
      MerchantTradeNo: `JT${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(0, 20),
      MerchantTradeDate: getECPayDate(),
      PaymentType: 'aio', // 必填：aio
      TotalAmount: String(customPrice || 498),
      TradeDesc: 'DigitalInsightReport',
      ItemName: 'DataReport',
      ReturnURL: `${baseUrl}/api/ecpay/callback`,
      ChoosePayment: 'Credit', // 鎖定信用卡以利測試
      EncryptType: '1', // 1: SHA256
      ClientBackURL: `${baseUrl}/${lang}/reports`,
      OrderResultURL: `${baseUrl}/${lang}/success?product=${reportId}&lang=${lang}`,
      CustomField1: reportId, // 這是為了確保回傳時絕對能抓到商品 ID
      NeedExtraPaidInfo: 'Y',
    };

    // 計算檢查碼
    params['CheckMacValue'] = generateCheckMacValue(params, hashKey, hashIV);

    // 決定跳轉 URL：包含官方提供的多組測試 ID
    const isTestAccount = ['2000132', '3002607', '3002599', '3365120'].includes(merchantId);
    const finalGateway = isTestAccount ? ECPAY_STAGE_URL : ECPAY_PROD_URL;

    return NextResponse.json({
      paymentUrl: finalGateway,
      params: params
    });

  } catch (err: any) {
    console.error('[ECPay Final API Error]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
