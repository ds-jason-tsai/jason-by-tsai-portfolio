import { NextResponse } from 'next/server';
import crypto from 'crypto';

// 藍新金流付款完成後，會 POST 到這個 endpoint (NotifyURL)
// 藍新要求不回傳特定格式，只需回 HTTP 200 即可

const REPORT_DOWNLOAD_LINKS: Record<string, string | undefined> = {
  salesforce_se: process.env.DOWNLOAD_LINK_SALESFORCE_SE,
  // 新增報告時在這裡加對應的環境變數：
  // new_report: process.env.DOWNLOAD_LINK_NEW_REPORT,
};

/** AES-256-CBC 解密（藍新 TradeInfo）*/
function aesDecrypt(encrypted: string, key: string, iv: string): string {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(key),
    Buffer.from(iv),
  );
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export async function POST(req: Request) {
  try {
    const hashKey = process.env.NEWEBPAY_HASH_KEY;
    const hashIV  = process.env.NEWEBPAY_HASH_IV;

    if (!hashKey || !hashIV) {
      console.error('[NewebPay Callback] Missing env vars');
      return new Response('Missing config', { status: 200 });
    }

    // 藍新以 application/x-www-form-urlencoded POST
    const text   = await req.text();
    const params: Record<string, string> = {};
    for (const pair of text.split('&')) {
      const [k, v] = pair.split('=');
      if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || '');
    }

    const { Status, TradeInfo: encryptedInfo } = params;

    if (Status !== 'SUCCESS') {
      console.warn(`[NewebPay] Payment failed, Status=${Status}`);
      return new Response('OK', { status: 200 });
    }

    // 解密 TradeInfo
    const decrypted = aesDecrypt(encryptedInfo, hashKey, hashIV);
    const tradeData = Object.fromEntries(new URLSearchParams(decrypted));

    const { Amt, MerchantOrderNo, ItemDesc } = tradeData;
    // ItemDesc 對應 reportId（可改為在 CustomField 帶入）
    const reportId = Object.keys(REPORT_DOWNLOAD_LINKS).find(id =>
      (ItemDesc || '').toLowerCase().includes(id.replace('_', ''))
    ) || '';

    console.log(`[NewebPay] Payment SUCCESS — Order: ${MerchantOrderNo}, Amt: ${Amt}, Report: ${reportId}`);
    // TODO: 可寫入資料庫或發 Email

    return new Response('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
  } catch (err: any) {
    console.error('[NewebPay Callback Error]', err.message);
    return new Response('Error', { status: 200 });
  }
}
