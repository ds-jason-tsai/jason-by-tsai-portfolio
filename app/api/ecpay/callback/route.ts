import { NextResponse } from 'next/server';
import crypto from 'crypto';

// 綠界付款完成後，會 POST 到這個 endpoint
// 回傳必須是純文字 "1|OK"（成功）或 "0|Error..."（失敗）

const REPORT_DOWNLOAD_LINKS: Record<string, string> = {
  salesforce_se: 'https://drive.google.com/file/d/1SCD4IGORxikCEXHALAP3zuUt5ArDnvkf/view?usp=sharing',
};

function verifyCheckMacValue(
  params: Record<string, string>,
  hashKey: string,
  hashIV: string,
): boolean {
  const received = params['CheckMacValue'];
  const { CheckMacValue: _omit, ...rest } = params;
  const sortedKeys = Object.keys(rest).sort();
  const queryString = sortedKeys.map((k) => `${k}=${rest[k]}`).join('&');
  const rawString = `HashKey=${hashKey}&${queryString}&HashIV=${hashIV}`;

  const encoded = encodeURIComponent(rawString)
    .replace(/%20/g, '+')
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .toLowerCase();

  const calculated = crypto.createHash('sha256').update(encoded).digest('hex').toUpperCase();
  return calculated === received?.toUpperCase();
}

export async function POST(req: Request) {
  try {
    const hashKey = process.env.ECPAY_HASH_KEY;
    const hashIV = process.env.ECPAY_HASH_IV;

    if (!hashKey || !hashIV) {
      return new Response('0|Missing env', { status: 200 }); // ECPay 要求回 200
    }

    // 綠界 Callback 是 application/x-www-form-urlencoded
    const text = await req.text();
    const params: Record<string, string> = {};
    for (const pair of text.split('&')) {
      const [k, v] = pair.split('=');
      if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || '');
    }

    // 驗證 CheckMacValue（防偽造）
    if (!verifyCheckMacValue(params, hashKey, hashIV)) {
      console.error('[ECPay Callback] CheckMacValue mismatch');
      return new Response('0|CheckMacValue Error', { status: 200 });
    }

    const { RtnCode, CustomField1: reportId } = params;

    if (RtnCode === '1') {
      // 付款成功
      // TODO：可在此寫入資料庫紀錄，或觸發 Email 通知
      const downloadUrl = reportId ? REPORT_DOWNLOAD_LINKS[reportId] : null;
      console.log(`[ECPay] Payment OK for ${reportId}, download: ${downloadUrl}`);
    } else {
      console.warn(`[ECPay] Payment failed, RtnCode=${RtnCode}`);
    }

    // 必須回傳 "1|OK" 讓綠界知道我們收到了
    return new Response('1|OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
  } catch (err: any) {
    console.error('[ECPay Callback Error]', err.message);
    return new Response('0|Error', { status: 200 });
  }
}
