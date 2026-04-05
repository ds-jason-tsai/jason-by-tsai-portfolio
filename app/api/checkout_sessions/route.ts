import { NextResponse } from 'next/server';
import crypto from 'crypto';

// ─────────────────────────────────────────────
// 待填入：申請綠界後在 Vercel 環境變數設定這三個值
// ECPAY_MERCHANT_ID  → 你的廠商編號 (MerchantID)
// ECPAY_HASH_KEY     → HashKey
// ECPAY_HASH_IV      → HashIV
// NEXT_PUBLIC_BASE_URL → 你的正式域名 e.g. https://your-site.vercel.app
// ─────────────────────────────────────────────

// 測試環境 URL（開發時用）
const ECPAY_STAGE_URL = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5';
// 正式環境 URL（上線時換成這個）
const ECPAY_PROD_URL = 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const ECPAY_URL = IS_PRODUCTION ? ECPAY_PROD_URL : ECPAY_STAGE_URL;

// 報告目錄 —— 之後新增商品在這裡加
const REPORT_CATALOG: Record<string, { name: string; price: number; description: string }> = {
  salesforce_se: {
    name: 'Case Study: Salesforce Solution Engineer Pitch',
    price: 498,
    description: 'C-level 專業簡報，涵蓋執行摘要、企業痛點、解決方案、技術架構及 Next Step。',
  },
};

/** 綠界 CheckMacValue 計算（SHA256）*/
function generateCheckMacValue(
  params: Record<string, string>,
  hashKey: string,
  hashIV: string,
): string {
  const sortedKeys = Object.keys(params).sort();
  const queryString = sortedKeys.map((k) => `${k}=${params[k]}`).join('&');
  const rawString = `HashKey=${hashKey}&${queryString}&HashIV=${hashIV}`;

  // 綠界要求的 URL encode（類 .NET 風格，特定符號轉換）
  const encoded = encodeURIComponent(rawString)
    .replace(/%20/g, '+')
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .toLowerCase();

  return crypto.createHash('sha256').update(encoded).digest('hex').toUpperCase();
}

/** 產生不重複的訂單編號（英數字，最長20碼）*/
function generateTradeNo(): string {
  const now = new Date();
  const ts = [
    now.getFullYear().toString().slice(2),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join('');
  const rand = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `JT${ts}${rand}`.slice(0, 20); // 最長 20 碼
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reportId, lang = 'zh' } = body;

    const merchantId = process.env.ECPAY_MERCHANT_ID;
    const hashKey = process.env.ECPAY_HASH_KEY;
    const hashIV = process.env.ECPAY_HASH_IV;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // 開發環境：如果沒有設定 Keys，回傳一個友善提示
    if (!merchantId || !hashKey || !hashIV) {
      return NextResponse.json(
        { error: 'ECPay 環境變數尚未設定，請在 Vercel 後台填入 ECPAY_MERCHANT_ID、ECPAY_HASH_KEY、ECPAY_HASH_IV。' },
        { status: 503 },
      );
    }

    const catalog = REPORT_CATALOG[reportId];
    if (!catalog) {
      return NextResponse.json({ error: `找不到商品：${reportId}` }, { status: 404 });
    }

    const tradeDate = (() => {
      const d = new Date();
      return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    })();

    const params: Record<string, string> = {
      MerchantID: merchantId,
      MerchantTradeNo: generateTradeNo(),
      MerchantTradeDate: tradeDate,
      PaymentType: 'aio',
      TotalAmount: String(catalog.price),
      TradeDesc: encodeURIComponent(catalog.description).slice(0, 200),
      ItemName: catalog.name.slice(0, 200),
      ReturnURL: `${baseUrl}/api/ecpay/callback`,         // 綠界伺服器 POST 回報（付款結果）
      OrderResultURL: `${baseUrl}/${lang}/success?product=${reportId}`, // 前端跳轉
      ChoosePayment: 'ALL',                                // 全支付方式（信用卡/ATM/超商）
      EncryptType: '1',                                    // 固定 1 = SHA256
      ClientBackURL: `${baseUrl}/${lang}/reports`,         // 取消後返回
    };

    params.CheckMacValue = generateCheckMacValue(params, hashKey, hashIV);

    // 回傳 ECPay 的 URL 與 params，讓前端用 form POST 送出
    return NextResponse.json({ ecpayUrl: ECPAY_URL, params });
  } catch (err: any) {
    console.error('ECPay Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
