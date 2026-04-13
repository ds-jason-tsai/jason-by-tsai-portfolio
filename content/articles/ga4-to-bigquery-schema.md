---
title:
  zh: "GA4 匯出至 BigQuery 的資料結構"
  en: "GA4 BigQuery Export Schema Explained"
  ja: "GA4からBigQueryへのエクスポートデータ構造"
description:
  zh: "當 Google Analytics 4 (GA4) 數據匯出至 BigQuery 後，理解其複雜的 RECORD 與 STRUCT 巢狀資料結構是進行進階分析的首要任務。本文深入解析 GA4 在 BigQuery 中的 Schema 架構，並將其拆解為「事件」與「使用者」兩大核心主軸。我們將說明重要欄位定義、資料清洗的緩衝機制，以及如何優化 SQL 查詢以捕捉精確的數位軌跡。這份完整的 BigQuery 資料結構指南，能幫助分析師與工程師建立可靠的數據模型並產出商業洞察。"
  en: "Mastering the GA4 BigQuery export schema is essential for advanced data analysis. This guide provides a detailed breakdown of the complex RECORD and STRUCT nested data structures, categorizing fields into 'Events' and 'Users' dimensions. Learn about key field definitions, data cleansing buffer strategies, and how to handle nested parameters for efficient SQL querying. Perfect for data analysts and engineers looking to build robust data models and unlock deep behavioral insights from raw GA4 data."
  ja: "Google アナリティクス 4 (GA4) から BigQuery へのエクスポート機能は生データ分析に強力ですが、その構造は RECORD や STRUCT 等の複雑なネスト型で構成されています。本記事では、GA4 データのスキーマを「イベント」と「ユーザー」の 2 軸に分けて分かりやすく解説。データクレンジングのポイントから各フィールドの定義、実践的な分析 Tips まで現役アナリストが紹介します。BigQuery を活用して高度な顧客行動分析やマーケティング最適化を目指す方のための実践ガイドです。"
date: "2023-11-07"
tags:
  zh: ["#GA4", "#BigQuery", "#資料分析"]
  en: ["#GA4", "#BigQuery", "#DataAnalytics"]
  ja: ["#GA4", "#BigQuery", "#データ分析"]
---

當資料從 GA4 被匯出至 BigQuery 後，便要開始思考如何進行數據清洗，以利後續針對用戶的數位軌跡進行分析。本文說明 GA4 資料表各欄位的定義，並將其分為「事件」和「使用者」兩大主軸。

首先我們知道 GA4 是以「天」為單位，將資料批次匯入 BigQuery(以下簡稱 BQ) 當中。而經過筆者實測以及總結各界經驗後發現，GA4 的數據彙整需要有 2 天左右的緩衝。這邊的緩衝是基於部份使用者的數位軌跡在匯入 GA4 時會有延遲的情形，因此建議在分析時，篩選最新至 D-2 的日期較為恰當。

有了上述認知後，我們可以先看到 BQ 的 Schema，GA4 資料中的某些欄位是以 RECORD 的型態儲存、且欄位數量頗多。實際上，GA4 匯出至 BQ 的資料大致可分為事件和使用者兩類。

## 事件 Event

- `event_date` | STRING | 事件時間(格式為 YYYYMMDD )
- `event_timestamp` | INTEGER | 事件時間(以 UTC 紀錄至微秒)
- `event_previous_timestamp` | INTEGER | 事件前一次被記錄的時間
- `event_name` | STRING | 事件名稱
- `event_value_in_usd` | FLOAT | 將事件中 value 參數轉為美元的數值
- `event_bundle_sequence_id` | INTEGER | 事件被上傳時的序列 ID
- `event_server_timestamp_offset` | INTEGER | 事件從蒐集到上傳的時間差

GA4 資料在匯入 BigQuery 後會自動以 `event_date` 來區隔資料表。透過上方敘述可知，`event_bundle_sequence_id` 和 `event_server_timestamp_offset` 兩個欄位與後續分析的關聯性較低，比較實用的可能是前幾個。

除上述欄位之外，事件的參數會以 BQ 當中的 STRUCT 格式被記錄。BQ 透過這種巢狀的資料型態將同一事件的多組 `{key(param_name): value}` 儲存在同一筆紀錄當中，具體如下：

- `event_params.key` | STRING
- `event_params.value` | RECORD | 存放 key 對應的參數值
- `event_params.value.string_value` | ex: URL
- `event_params.value.int_value` | ex: ga_session_id

實際上，一個事件參數(event_params.key)的 value 只會對應到一種特定的資料型態。如 `event_params.key = page_location` 時，只有 `string_value` 會顯示其對應的 URL，而其他則顯示為 `null`。

## 「事件」的流量來源 Collected_Traffic_Source

- `manual_campaign_id` | 廣告活動 ID
- `manual_campaign_name` | 廣告活動名稱
- `manual_source` | 廣告活動來源
- `manual_medium` | 廣告活動媒介
- `manual_term` | 廣告活動關鍵字
- `gclid` | Google Click ID

其中又以 Source & Medium 最為重要。假設我們在 Line OA 透過輪播版位的方式來投放廣告，Source 可以寫作 Line、而 Medium 則是 Carousel。良好的 UTM 管理在實務上能帶來諸多好處。

## 使用者 User

- `user_id` | STRING | unique ID (需透過 GTM 蒐集，預設為 null )
- `user_pseudo_id` | STRING | 匿名 ID
- `is_active_user` | BOOLEAN | 以天為單位，紀錄使用者的活躍與否
- `user_first_touch_timestamp` | INTEGER | 使用者初次造訪網頁的時間點

值得一提的是，`user_pseudo_id` 是由兩組數字所構成(如 `1806154613.1698723554`)。前方是隨機亂碼，後方則是初次造訪時的 `ga_session_id`。

在什麼情況下 `is_active_user` 會被判定為 True 呢？當使用者為新使用者或在當日有互動工作階段 (Engaged Session) 時。互動工作階段需滿足：
1. 持續 10 秒以上
2. 瀏覽 2 個以上的網頁
3. 觸發 1 次以上的轉換事件

## 裝置 Device

- `device.category` | STRING | 裝置類型(手機、平板、電腦)
- `device.operating_system` | STRING | 作業系統(iOS、Windows)
- `device.web_info.browser` | STRING | 瀏覽器

如果主管想了解不同數位平台使用者的裝置和品牌差異，使用 `category` 加上 `mobile_brand_name` 或許就能夠滿足需求。

## 地理位置 Geo

GA4 以事件發生當下的 IP 位址為依據儲存使用者地理位置：
- `geo.continent` | 洲別
- `geo.country` | 國家/地區
- `geo.region` | 區域(台北市、台中市等)

## 其他 Others

- `stream_id` | 事件來源的資料串流 ID
- `platform` | 事件來源的資料串流平台(Web、iOS、Android)

以上是 GA4 將 raw data 匯入 BQ 後資料樣態的一點分享以及欄位說明。希望這份總整能對初接觸 GA4 或需要清理 BigQuery 結構的朋友帶來幫助。

**Reference**
- [GA4] BigQuery Export schema
