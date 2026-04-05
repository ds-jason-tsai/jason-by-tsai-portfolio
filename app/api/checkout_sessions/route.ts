import { NextResponse } from 'next/server';
import crypto from 'crypto';

// ─────────────────────────────────────────────
// 藍新金流 (NewebPay) MPG 幕前支付
// 需在 Vercel 環境變數設定：
//   NEWEBPAY_MERCHANT_ID  → 商店代號
//   NEWEBPAY_HASH_KEY     → HashKey
//   NEWEBPAY_HASH_IV      → HashIV
//   NEXT_PUBLIC_BASE_URL  → 正式網域 e.g. https://your.vercel.app
// ─────────────────────────────────────────────

// 測試環境（開發用）
const NEWEBPAY_STAGE_URL = 'https://ccore.newebpay.com/MPG/mpg_gateway';
// 正式環境（上線時使用）
const NEWEBPAY_PROD_URL  = 'https://core.newebpay.com/MPG/mpg_gateway';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const NEWEBPAY_URL  = IS_PRODUCTION ? NEWEBPAY_PROD_URL : NEWEBPAY_STAGE_URL;

// 商品目錄 — 之後新增報告在這裡加
const REPORT_CATALOG: Record<string, { name: string; price: number }> = {
  salesforce_se: {
    name: 'Case Study: Salesforce Solution Engineer Pitch',
    price: 498,
  },
};

/** AES-256-CBC 加密（藍新 TradeInfo）*/
function aesEncrypt(data: string, key: string, iv: string): string {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(key),
    Buffer.from(iv),
  );
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

/** SHA-256 雜湊（藍新 TradeSha）*/
function sha256Hash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex').toUpperCase();
}

/** 產生不重複的訂單號（20碼英數字）*/
function generateOrderNo(): string {
  const now  = new Date();
  const ts   = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  const rand = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `JT${ts}${rand}`.slice(0, 20);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reportId, lang = 'zh', price: customPrice, productName: customName } = body;

    const merchantId = (process.env.NEWEBPAY_MERCHANT_ID || '').trim();
    const hashKey    = (process.env.NEWEBPAY_HASH_KEY || '').trim();
    const hashIV     = (process.env.NEWEBPAY_HASH_IV || '').trim();
    const baseUrl    = (process.env.NEXT_PUBLIC_BASE_URL || '').trim();

    if (!merchantId || !hashKey || !hashIV) {
      return NextResponse.json(
        { error: '藍新金流環境變數尚未設定（NEWEBPAY_MERCHANT_ID / HASH_KEY / HASH_IV）。請在 Vercel 後台 Settings → Environment Variables 填入。' },
        { status: 503 },
      );
    }

    const catalog     = REPORT_CATALOG[reportId];
    const itemName    = customName  || catalog?.name  || '數位分析報告';
    const amount      = customPrice || catalog?.price || 0;
    const orderNo     = generateOrderNo();
    const timeStamp   = Math.floor(Date.now() / 1000).toString();

    // ─────────────────────────────────────────────
    // 重要：AES 加密前的字串不可進行 URL Encoding
    // ─────────────────────────────────────────────
    const tradeParams = [
      `MerchantID=${merchantId}`,
      `RespondType=JSON`,
      `TimeStamp=${timeStamp}`,
      `Version=2.0`,
      `MerchantOrderNo=${orderNo}`,
      `Amt=${amount}`, // 藍新 2.0 使用 Amt 做為金額欄位
      `ItemDesc=${itemName.slice(0, 50)}`,
      `ReturnURL=${baseUrl}/${lang}/success?product=${reportId}`,
      `NotifyURL=${baseUrl}/api/newebpay/callback`,
      `ClientBackURL=${baseUrl}/${lang}/reports`,
      `LoginType=0`,
      `CREDIT=1`,
    ].join('&');

    // 決定閘道網址 (如果 MerchantID 是 MS 開頭則強制走測試環境)
    const finalGateway = merchantId.startsWith('MS') ? NEWEBPAY_STAGE_URL : NEWEBPAY_URL;

    // Step 1: AES 加密 → TradeInfo
    const tradeInfo = aesEncrypt(tradeParams, hashKey, hashIV);

    // Step 2: SHA256 雜湊 → TradeSha
    const tradeSha = sha256Hash(`HashKey=${hashKey}&${tradeInfo}&HashIV=${hashIV}`);

    return NextResponse.json({
      newebpayUrl: finalGateway,
      params: {
        MerchantID: merchantId,
        TradeInfo:  tradeInfo,
        TradeSha:   tradeSha,
        Version:    '2.0',
      },
    });
  } catch (err: any) {
    console.error('[NewebPay Checkout Error]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
