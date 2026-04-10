---
title:
  zh: "數位軌跡分析 | 何謂 GA4 事件？"
  en: "GA4 Event Guide | Digital Footprint"
  ja: "デジタル行動分析 | GA4イベントとは？"
description:
  zh: "深入探討 Google Analytics 4 (GA4) 以「事件」為核心的分析架構。本文詳細拆解 GA4 的四種關鍵事件類型：自動收集、加強型評估、建議事件及自訂事件。透過專業分析師的視角，幫助您更精確地捕捉使用者在網站上的數位軌跡，優化 Data Mart 建置與數據報表可靠性。適合所有希望從通用 GA 順利轉型至 GA4 的行銷人員與數據分析專家參考。"
  en: "Master Google Analytics 4 (GA4) event tracking. This comprehensive guide explains the fundamental shift from sessions to events and details the four essential event types: Automatically Collected, Enhanced Measurement, Recommended, and Custom events. Learn how to accurately track digital footprints, enhance data mart reliability, and build superior analytics reports. Perfect for data analysts and digital marketers transitioning to the next generation of analytics."
  ja: "Google アナリティクス 4 (GA4) の分析構造は、従来のユニバーサル アナリティクスとは根本的に異なり「イベント」を基盤としています。本記事では、自動収集イベント、拡張計測機能イベント、推奨イベント、カスタムイベントという 4 つの主要なイベントタイプについて、現役アナリストの視点から設定方法や活用術を詳しく解説します。データ分析の精度を高め、デジタルトレースを正確に把握するための基礎知識を提供。GA4 を活用したデータ基盤構築やレポート作成にぜひ役立ててください。"
date: "2023-10-10"
tags:
  zh: ["#GA4", "#數據分析", "#數位軌跡"]
  en: ["#GA4", "#DataAnalytics", "#DigitalFootprint"]
  ja: ["#GA4", "#データ分析", "#デジタルトレース"]
---

近期因為工作的關係開始大量接觸 Google Analytics，筆者主要負責 GA4 Data Mart 的設計以及雲端資料流的處理，希望能透過文章與各界 GA 使用者分享並交流數位軌跡的追蹤心得。

與通用 GA 不同，GA4 的分析結構以「事件」為基礎，其中 GA4 的事件又可分為**自動事件、加強型評估事件、建議事件**以及**自訂事件**等 4 大類，本文將逐個介紹並說明其中差異。

## 自動事件 (Automatically collected events)

以 Web 為例，GA4 的自動事件包括以下四項：
- **`user_engagement`**: 紀錄使用者離開或前往下一個網頁的時間
- **`session_start`**: 紀錄使用者的各個工作階段
- **`first_visit`**: 紀錄使用者初次造訪網頁的資訊
- **`page_view`**: 紀錄使用者瀏覽網頁的狀態

假設某個使用者初次造訪了我們的網頁，GA4 就會自動觸發 `first_visit`、`page_view` 以及 `session_start` 等 3 個事件。其中，`first_visit` 只有在每個使用者初次造訪網頁時才會觸發，而 `user_engagement_msec` 則是 `user_engagement` 的一個參數，以毫秒的方式紀錄時間。

## 加強型評估事件 (Enhanced measurement events)

GA4 的加強型評估事件比自動事件更複雜一些，主要是以下六項：
- **`file_download`**: 下載檔案
- **`click`**: 點擊外連 (Outbound) 連結
- **`scroll`**: 網頁滾動
- **`video_related`**: 觀看影片
- **`form_related`**: 填寫表單
- **`view_search_result`**: 站內搜尋

每次使用者在網頁上填寫表單時，GA4 即記錄表單互動事件（包含 `form_start` 與 `form_submit` 兩類）。
大家若在網址上發現類似 `_gl=1*1f88n17*_ga*NzY...` 的 query，就表示該網頁可能有開啟外連追蹤。另外，使用者如果瀏覽至底部(預設為 90%)，就會觸發一次捲動事件 (`scroll`)。實務上也常透過 GTM 去設定 25%、50% 以及 75% 的捲動事件。

## 建議事件 (Recommended events)

GA4 的建議事件是 Google 為不同產業所生成的推薦清單，目前的官方說明有：
- **所有資源**: 建議所有產業採用的事件
- **線上銷售**: 包括 `purchase` (完成購買)、`view_cart` (查看購物車)等
- **遊戲**: 包括 `level_start` (新關卡)、`unlock_achievement` (解鎖成就)等

皆可透過 GTM(Google Tag Manager) 來無縫完成。

## 自訂事件 (Custom events)

顧名思義，自訂事件即 GA4 當中自由度最高的事件。在設定自訂事件之前，我們可以先觀察上述自動、加強型以及建議事件是否已經滿足大家對數位軌跡的分析需求，若無再研究即可。

如果希望在 GA4 完成自訂事件的設定，可以透過：
1. **GA4 後台** - 管理 > 事件 > 建立事件
2. **GTM** - [Google Tag Manager](https://tagmanager.google.com/)

---
以上是關於 GA4 事件的分享，未來分析師如果能更全面理解每個 Event 觸發的含義與時機點，在建置 Data Mart 甚至是報表時皆能更為可靠。

**Reference**
- [GA4] About events
- [GA4] Automatically collected events
