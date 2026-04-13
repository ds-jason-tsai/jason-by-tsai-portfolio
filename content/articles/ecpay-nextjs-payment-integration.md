---
title:
  zh: "綠界金流串接實戰：Next.js + Vercel 打造高安全性的數位商品購買系統"
  en: "ECPay Payment Integration: Building a Secure Digital Product Checkout with Next.js & Vercel"
  ja: "ECPay決済連携実践：Next.js + Vercelで高セキュリティなデジタル商品購入システムを構築"
description:
  zh: "本文完整記錄了從零開始串接台灣綠界 (ECPay) 金流的實戰過程，涵蓋 CheckMacValue 加密驗證、OrderResultURL 安全跳轉、HMAC 數位簽章防盜連結、Google Apps Script 自動化通知與對帳等核心技術。無論您是前端工程師、獨立開發者或是希望在自己的作品集中加入付費功能的數據分析師，都能從這份真實踩坑與除錯歷程中獲得寶貴的開發經驗與可直接套用的程式碼架構。"
  en: "A complete, battle-tested guide to integrating ECPay (Taiwan's leading payment gateway) with a Next.js application deployed on Vercel. This article covers CheckMacValue cryptographic verification, secure OrderResultURL redirects with HMAC digital signatures, anti-piracy time-limited download links, and automated Google Sheets logging via Google Apps Script. Whether you are a frontend developer, indie maker, or data analyst adding paid features to your portfolio, you will find actionable code patterns and real-world debugging insights here."
  ja: "台湾最大級の決済ゲートウェイ「ECPay (緑界)」を Next.js + Vercel 環境で統合した実践記録です。CheckMacValue 暗号検証、OrderResultURL のセキュアリダイレクト、HMAC デジタル署名による不正コピー防止、Google Apps Script を活用した自動通知・売上管理まで、実際のデバッグ経験を交えて解説します。フロントエンド開発者、個人開発者、またはポートフォリオに課金機能を追加したいデータアナリストに最適なガイドです。"
date: "2026-04-13"
tags:
  zh: ["#技術教學", "#金流串接", "#Nextjs", "#Vercel"]
  en: ["#Tutorial", "#PaymentIntegration", "#Nextjs", "#Vercel"]
  ja: ["#技術チュートリアル", "#決済連携", "#Nextjs", "#Vercel"]
---

## 前言：為什麼身為數據分析師，我要自己串金流？

身處知識經濟的時代，越來越多專業人士開始將自己的分析報告、線上課程與數據包作為數位商品販售。然而，大部分的電商平台（如 Shopify、Gumroad）都會抽取 5% 到 15% 的手續費，而且在台灣的本地化支持有限。

因此，我決定在自己的 Next.js 個人作品集網站上，直接串接台灣最大的第三方金流服務「**綠界科技 (ECPay)**」。這篇文章將完整記錄我在 2026 年 4 月 13 日這一天從零到上線的實戰歷程，包含所有踩過的坑、除過的錯，以及最終打造出的高安全性數位商品購買系統的完整架構。

## 系統架構總覽

在正式進入程式碼之前，先讓我們理解整個系統的運作流程。當一位顧客點擊「立即解鎖」按鈕時，以下事件會依序發生：

1. **前端觸發** → 呼叫 `/api/checkout_sessions` 產生訂單參數與 CheckMacValue
2. **跳轉綠界** → 使用者被導向綠界的安全付款頁面 (AIO Checkout V5)
3. **付款完成** → 綠界背景通知我們的 `/api/ecpay/callback`（ReturnURL）
4. **瀏覽器跳轉** → 綠界把使用者的畫面跳轉到 `/api/ecpay/result`（OrderResultURL）
5. **安全導向** → 我們的 Result API 驗證成功後，產生帶有 HMAC 簽章與時效的加密連結，導向 `/success` 頁面
6. **自動化通知** → 在跳轉的過程中，同步將交易資料推送至 Google Apps Script（更新 Google Sheet + 寄出信件通知）

## 第一關：CheckMacValue 加密驗證

### 什麼是 CheckMacValue？

`CheckMacValue` 是綠界用來確認「這筆交易請求真的是你發出的，而不是駭客假冒的」的數位簽章。每一筆送出的訂單，都必須附上這串 SHA-256 雜湊值，綠界收到後會用同樣的方式計算一次，如果兩邊對不上，交易就會被直接拒絕。

### 核心演算法

產生 CheckMacValue 的步驟如下：

1. 將所有參數按照 **Key 名稱的字母順序排列**
2. 將排列結果串接成 `Key1=Value1&Key2=Value2...` 的 QueryString 格式
3. 在最前面加上 `HashKey=你的金鑰&`，最後面加上 `&HashIV=你的向量`
4. 進行 **URL Encode**，並全部**轉為小寫**
5. 取 **SHA-256** 雜湊值，並全部**轉為大寫**

```typescript
function generateCheckMacValue(
  params: Record<string, string>, 
  hashKey: string, 
  hashIV: string
): string {
  const sortedKeys = Object.keys(params).sort();
  const queryString = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
  const rawString = `HashKey=${hashKey}&${queryString}&HashIV=${hashIV}`;
  const encodedString = ecpayUrlEncode(rawString);
  const hash = crypto.createHash('sha256').update(encodedString).digest('hex');
  return hash.toUpperCase();
}
```

### 踩坑紀錄：URL Encode 的魔鬼細節

這裡有一個讓我卡了非常久的大坑：JavaScript 的 `encodeURIComponent` 跟綠界後端 (C#) 的 `HttpUtility.UrlEncode` 的轉換規則**不完全相同**！

例如，JavaScript 預設不會轉換波浪號 `~`，但綠界會把它轉成 `%7e`。如果不處理這個差異，你算出來的 CheckMacValue 永遠會跟綠界算出來的不一樣，交易就永遠過不了！

```typescript
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
    .replace(/~/g, '%7e'); // 關鍵：波浪號必須被轉為 %7e
  return encoded;
}
```

### 踩坑紀錄：排序方式的語系陷阱

另一個隱藏地雷是排序方式。在驗證綠界回傳資料時，必須使用 **case-insensitive（不分大小寫）** 的排序方式：

```typescript
const sortedKeys = Object.keys(params).sort(function (a, b) {
  return a.toLowerCase().localeCompare(b.toLowerCase());
});
```

如果使用預設的 `.sort()` 排序，大寫字母會排在小寫前面，導致 QueryString 順序與綠界不一致，CheckMacValue 驗證就會失敗。

## 第二關：安全的支付結果處理

### ReturnURL vs OrderResultURL

綠界有兩個容易混淆但功能完全不同的回傳機制：

| 機制 | 說明 | 對象 |
|---|---|---|
| **ReturnURL** (Callback) | 綠界伺服器在背景默默通知你的 API | 伺服器對伺服器 |
| **OrderResultURL** (Result) | 綠界把消費者的瀏覽器畫面跳轉回你的網站 | 消費者瀏覽器 |

最大的坑在於：在正式環境下，ReturnURL 的背景通知可能會有 **5 到 20 分鐘的延遲**（尤其是尖峰時段），這意味著如果你把「更新資料庫」或「寄信通知」的邏輯放在 ReturnURL 裡面，使用者付完錢後可能要等很久才能收到確認。

### 解決方案：前景同步

我們最終決定將所有「即時通知」的功能（Google Sheet 寫入 + Email 發送）移到 **OrderResultURL 的處理路由** 裡面。因為 OrderResultURL 是跟著消費者的瀏覽器一起跳轉的，所以它會在付款完成的「當下」就被觸發，不存在任何延遲問題。

```typescript
// /api/ecpay/result (OrderResultURL Handler)
if (data.RtnCode === '1') {
  // 付款成功！立即同步更新 Google Sheet + 寄信
  const gasRes = await fetch(GAS_URL_ECPAY, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      merchantTradeNo: data.MerchantTradeNo,
      product: product,
      amount: data.TradeAmt,
      // ...其他欄位
    })
  });
  
  // 接著產生安全連結，把消費者導向 success 頁面
  const timestamp = Date.now().toString();
  const signature = crypto.createHmac('sha256', hashKey)
    .update(`${product}:${timestamp}`)
    .digest('hex');
  
  return NextResponse.redirect(successUrl, 303);
}
```

## 第三關：HMAC 防盜連結機制

### 問題：付款成功頁面的安全漏洞

最初，我們的成功頁面路徑長這樣：`/zh/success?product=notebooklm_series`。問題是，任何人只要知道這個 URL 和商品 ID，就能直接在瀏覽器輸入網址來存取付費內容，完全不用付錢！

### 解決方案：數位簽章 + 時效限制

我們採用了 **HMAC-SHA256 數位簽章**來保護成功頁面。具體做法是：

1. 付款成功時，用綠界的 HashKey 作為密鑰，對 `{商品ID}:{時間戳記}` 進行 HMAC 簽章
2. 把簽章跟時間戳記一起塞進 URL 的 query string
3. 成功頁面收到這些參數後，用同一把密鑰重新計算一次簽章，看看是否一致
4. 加入 **30 分鐘的時效限制**，超過就自動失效

```typescript
// 驗證連結是否合法且未過期
const expectedSig = crypto.createHmac('sha256', hashKey)
  .update(`${productId}:${token}`)
  .digest('hex');

if (expectedSig === signature) {
  const now = Date.now();
  const tokenTime = parseInt(token, 10);
  // 30 分鐘時效 (1800000 毫秒)
  if (!isNaN(tokenTime) && now - tokenTime < 1800000) {
    isValid = true;
  }
}
```

這樣一來，就算有人把成功頁面的網址複製給朋友，30 分鐘後那串密碼就會自動失效，完美杜絕盜連行為！

## 第四關：Google Apps Script 自動化通知

### 架構設計

我們使用 Google Apps Script (GAS) 作為輕量級的 Webhook 接收器，它負責兩件事：

1. **寫入 Google Sheet**：將每筆訂單的詳細資料（單號、商品、金額、付款方式等）自動記錄到試算表中
2. **寄出 Email 通知**：在收到交易資料的同時，透過 Gmail 發送一封格式精美的交易通知信給管理者

### 踩坑紀錄：Content-Type 與 GAS 的相容性

這裡有一個有趣的發現：Google Apps Script 在處理外部 POST 請求時，如果 Content-Type 設為 `application/json`，GAS 可能會因為 CORS 與 302 Redirect 的問題導致資料在傳輸過程中「漏接」。

解決方案是改用 `text/plain` 作為 Content-Type，然後在 GAS 端用 `JSON.parse(e.postData.contents)` 手動解析：

```javascript
// GAS 端
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  // ...後續處理
}
```

```typescript
// Vercel 端
const gasRes = await fetch(GAS_URL_ECPAY, {
  method: 'POST',
  redirect: 'follow', // 跟隨 GAS 的 302 重新導向
  headers: { 'Content-Type': 'text/plain' },
  body: JSON.stringify(payload)
});
```

### 踩坑紀錄：工作表名稱不匹配

另一個看似微不足道，但卻導致整個自動化系統完全失靈的錯誤：GAS 程式碼中寫死了 `getSheetByName('Sales')`，但實際的 Google 試算表分頁名稱並不叫 `Sales`。

結果就是，程式碼在嘗試寫入表單時直接拋出錯誤中斷，連後面的 Email 發送功能都被一起「腰斬」了。解決方案是改用防呆寫法 `getSheets()[0]`，直接強制寫入第一個分頁，不管它叫什麼名字。

## 第五關：付款失敗的用戶體驗

### 問題場景

在測試過程中，我們發現當使用者的 Apple Pay 授權失敗或信用卡交易被拒絕時，綠界不會給予任何友善的提示，使用者只會被冷冰冰地丟回原頁面，非常困惑。

### 解決方案：專屬失敗頁面

我們為此打造了一個專屬的失敗頁面 (`/failed`)，提供多語系的友善錯誤提示，並附上兩個明確的行動按鈕：

- **重新嘗試購買**：直接跳轉回付費專區
- **聯繫客服**：透過 Email 聯絡我們

這個小小的 UX 優化，看似不重要，但在實際的電商轉換率上往往能帶來顯著的提升。

## 安全性總結

最終系統的安全防護等級如下：

| 防護層 | 機制 | 說明 |
|---|---|---|
| 第一層 | CheckMacValue | 確保訂單請求沒有被竄改 |
| 第二層 | HMAC 數位簽章 | 確保只有真正付款的人能存取內容 |
| 第三層 | 30 分鐘時效 | 防止連結被轉發給未付款的第三方 |
| 第四層 | 環境變數隔離 | 所有金鑰都存放在 Vercel 環境變數中，不會被推送到 GitHub |

## 結語

從最開始的 CheckMacValue 對不上，到 GAS 工作表名稱寫錯導致整個通知系統癱瘓，再到發現重複通知是因為 ReturnURL 跟 OrderResultURL 同時觸發──這一天的金流串接之旅充滿了各式各樣「教科書上不會教你的坑」。

但正是這些真實的除錯經驗，才是最有價值的技術資產。希望這篇文章能幫助到正在串接綠界金流的開發者，少走一些彎路，多省一些時間。

如果您也有類似的串接經驗或問題，歡迎透過我的作品集網站與我交流！

**推薦閱讀：**
- [GA4 與 BigQuery 的資料結構說明](/zh/articles/ga4-to-bigquery-schema?utm_source=portfolio&utm_medium=internal_link&utm_campaign=recommended_reading)
- [從 0 到 1：資料分析師的作品集 SEO 全指南](/zh/articles/portfolio-seo-best-practices?utm_source=portfolio&utm_medium=internal_link&utm_campaign=recommended_reading)
