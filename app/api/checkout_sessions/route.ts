import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * ─────────────────────────────────────────────
 * 綠界金流 (ECPay) AIO 串接方案 - V5 SHA256 版
 * ─────────────────────────────────────────────
 */

// 正式環境與測試環境 URL
const ECPAY_PROD_URL  = 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5';
const ECPAY_STAGE_URL = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5';

const REPORT_CATALOG: Record<string, { name: string; price: number }> = {
  salesforce_se: { name: 'Case Study: Salesforce Solution Engineer Pitch', price: 498 },
  notebooklm_series: { name: 'NotebookLM 知識庫完全指南', price: 898 },
  notebooklm_ja_learning: { name: 'NotebookLM x 日語學習夥伴', price: 898 },
  notebooklm_biz_analysis: { name: 'NotebookLM x 商業分析工具', price: 898 },
  notebooklm_chat_summary: { name: 'NotebookLM x 聊天紀錄 AI 摘要', price: 898 },
  notebooklm_finance_stock: { name: 'NotebookLM x 財務報表、股票分析', price: 898 },
};

/** 
 * 綠界專用 URL Encode (黃金標準版)
 * 嚴格遵循綠界 AIO V5 附錄：檢查碼機制
 */
function ecpayUrlEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/%20/g, '+')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/%7e/g, '~') // 增加：波浪號處理
    .toLowerCase();
}

/** 產生綠界 CheckMacValue (SHA256) */
function generateCheckMacValue(params: Record<string, string>, hashKey: string, hashIV: string): string {
  // 1. 排除 CheckMacValue 並排序
  const sortedKeys = Object.keys(params).sort();
  
  // 2. 組合 Query String
  let queryString = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
  
  // 3. 夾入 HashKey 與 HashIV
  const rawString = `HashKey=${hashKey}&${queryString}&HashIV=${hashIV}`;
  
  // 4. URL Encode 且轉小寫
  const encodedString = ecpayUrlEncode(rawString);
  
  // 5. SHA256 雜湊與大寫
  return crypto.createHash('sha256').update(encodedString).digest('hex').toUpperCase();
}

/** 產生唯一訂單號 (增加隨機性) */
function generateOrderNo(): string {
  const ts = Date.now().toString().slice(-10);
  const rand = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `JT${ts}${rand}`.slice(0, 20);
}

/** 取得符合綠界格式的時間字串 */
function getECPayDate(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
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
      return NextResponse.json({ error: 'Config Missing' }, { status: 503 });
    }

    const catalog     = REPORT_CATALOG[reportId];
    const rawName     = customName  || catalog?.name  || 'Report';
    // 簡化欄位內容：避免特殊字元在編碼過程中產生歧義
    const itemName    = rawName.replace(/[^\w\s\u4e00-\u9fa5]/g, '').slice(0, 50); 
    const amount      = customPrice || catalog?.price || 498;
    
    const params: Record<string, string> = {
      MerchantID: merchantId,
      MerchantTradeNo: generateOrderNo(),
      MerchantTradeDate: getECPayDate(),
      PaymentType: 'aio',
      TotalAmount: String(amount),
      TradeDesc: 'InsightsReport', // 簡化描述
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

    // 決定閘道 URL
    const finalGateway = merchantId === '2000132' ? ECPAY_STAGE_URL : ECPAY_PROD_URL;

    console.log(`[Checkout] Merchant: ${merchantId} | Gateway: ${finalGateway}`);

    return NextResponse.json({
      paymentUrl: finalGateway,
      params: params
    });

  } catch (err: any) {
    console.error('[ECPay Checkout Error]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
