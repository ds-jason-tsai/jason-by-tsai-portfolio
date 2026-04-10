import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * ─────────────────────────────────────────────
 * 綠界金流 (ECPay) AIO 串接方案
 * 需在 Vercel 環境變數設定：
 *   ECPAY_MERCHANT_ID  → 商店代號 (例如: 3496178)
 *   ECPAY_HASH_KEY     → HashKey
 *   ECPAY_HASH_IV      → HashIV
 *   NEXT_PUBLIC_BASE_URL  → 正式網域 e.g. https://your.vercel.app
 * ─────────────────────────────────────────────
 */

// 正式環境與測試環境 URL
const ECPAY_PROD_URL  = 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5';
const ECPAY_STAGE_URL = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// 商品目錄
const REPORT_CATALOG: Record<string, { name: string; price: number }> = {
  salesforce_se: {
    name: 'Case Study: Salesforce Solution Engineer Pitch',
    price: 498,
  },
  notebooklm_series: {
    name: 'NotebookLM 知識庫完全指南',
    price: 898,
  },
  notebooklm_ja_learning: {
    name: 'NotebookLM x 日語學習夥伴',
    price: 898,
  },
  notebooklm_biz_analysis: {
    name: 'NotebookLM x 商業分析工具',
    price: 898,
  },
  notebooklm_chat_summary: {
    name: 'NotebookLM x 聊天紀錄 AI 摘要',
    price: 898,
  },
  notebooklm_finance_stock: {
    name: 'NotebookLM x 財務報表、股票分析',
    price: 898,
  },
};

/** 綠界特有的 URL Encode 轉換錶 (由官方規格導出) */
function ecpayUrlEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/%20/g, '+')
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .toLowerCase();
}

/** 產生綠界 CheckMacValue (SHA256) */
function generateCheckMacValue(params: Record<string, string>, hashKey: string, hashIV: string): string {
  // 1. 依照 Key 排序 (A-Z)
  const sortedKeys = Object.keys(params).sort();
  
  // 2. 組合為 Query String (Key=Value)
  const queryString = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
  
  // 3. 組合 HashKey + QueryString + HashIV
  const rawString = `HashKey=${hashKey}&${queryString}&HashIV=${hashIV}`;
  
  // 4. 特殊 URL Encode 並轉小寫
  const encodedString = ecpayUrlEncode(rawString);
  
  // 5. SHA256 雜湊與大寫
  return crypto.createHash('sha256').update(encodedString).digest('hex').toUpperCase();
}

/** 產生不重複訂單號 (ECPay 限制 20 碼) */
function generateOrderNo(): string {
  const ts = Date.now().toString().slice(-10);
  const rand = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `JT${ts}${rand}`;
}

/** 取得符合綠界格式的時間字串 (YYYY/MM/DD HH:mm:ss) */
function getECPayDate(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reportId, lang = 'zh', price: customPrice, productName: customName } = body;

    // 從環境變數讀取綠界資訊 (安全做法)
    const merchantId = (process.env.ECPAY_MERCHANT_ID || '').trim();
    const hashKey    = (process.env.ECPAY_HASH_KEY || '').trim();
    const hashIV     = (process.env.ECPAY_HASH_IV || '').trim();
    const baseUrl    = (process.env.NEXT_PUBLIC_BASE_URL || 'https://jason-by-tsai-portfolio.vercel.app').trim();

    if (!merchantId || !hashKey || !hashIV) {
      return NextResponse.json(
        { error: '綠界金流環境變數尚未設定。請在 Vercel 後台填入 ECPAY_MERCHANT_ID / HASH_KEY / HASH_IV。' },
        { status: 503 },
      );
    }

    const catalog     = REPORT_CATALOG[reportId];
    const itemName    = customName  || catalog?.name  || 'Digital Insights';
    const amount      = customPrice || catalog?.price || 0;
    const orderNo     = generateOrderNo();
    const tradeDate   = getECPayDate();

    // 綠界 AIO CheckOut 參數要求 (注意：這裡的內容填寫原始文字，不進行預編碼)
    const params: Record<string, string> = {
      MerchantID: merchantId,
      MerchantTradeNo: orderNo,
      MerchantTradeDate: tradeDate,
      PaymentType: 'aio',
      TotalAmount: String(amount),
      TradeDesc: itemName.slice(0, 50), // 修正：不可預先編碼，否則雜湊值會報錯
      ItemName: itemName.replace(/,/g, '#'), // 使用官方建議的分隔符號
      ReturnURL: `${baseUrl}/api/ecpay/callback`,
      ChoosePayment: 'Credit', // 修正：強制指定信用卡，避免 ALL 的相容性問題
      EncryptType: '1', // 1 表 SHA256
      ClientBackURL: `${baseUrl}/${lang}/reports`,
      OrderResultURL: `${baseUrl}/${lang}/success?product=${reportId}`,
      NeedExtraPaidInfo: 'Y',
    };

    // 產生檢查碼
    const checkMacValue = generateCheckMacValue(params, hashKey, hashIV);
    params['CheckMacValue'] = checkMacValue;

    // 決定閘道網址：如果是測試用 ID 2000132 則走測試端；其餘實體 ID 走正式端
    // 解決 10300023 錯誤：確保正式 ID 不會誤入測試網址。
    const finalGateway = merchantId === '2000132' ? ECPAY_STAGE_URL : ECPAY_PROD_URL;

    console.log(`[ECPay Checkout] Merchant: ${merchantId}, Order: ${orderNo}, Gateway: ${finalGateway}`);

    return NextResponse.json({
      paymentUrl: finalGateway,
      params: params
    });

  } catch (err: any) {
    console.error('[ECPay Checkout Error]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
