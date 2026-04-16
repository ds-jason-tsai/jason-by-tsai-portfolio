---
title:
  zh: "GA4 數位軌跡分析實戰指南：深入掌握四大關鍵事件類型與數據建模技巧"
  en: "GA4 Digital Footprint Guide: Mastering Essential Event Types & Data Modeling"
  ja: "GA4 デジタル行動分析完全ガイド：4つの主要イベントタイプとデータ計測手法"
description:
  zh: "深入探討 Google Analytics 4 (GA4) 以「事件」為核心的分析架構。本文詳細拆解 GA4 的四種關鍵事件類型：自動收集、加強型評估、建議事件及自訂事件。透過專業分析師的視告，幫助您更精確地捕捉使用者在網站上的數位軌跡，優化 Data Mart 建置與數據報表可靠性。適合所有希望從通用 GA 順利轉型至 GA4 的行銷人員與數據分析專家參考。"
  en: "Master Google Analytics 4 (GA4) event tracking. This comprehensive guide explains the fundamental shift from sessions to events and details the four essential event types: Automatically Collected, Enhanced Measurement, Recommended, and Custom events."
  ja: "Google アナリティクス 4 (GA4) の分析構造は、従来のユニバーサル アナリティクスとは根本的に異なり「イベント」を基盤としています。本記事では、自動収集イベント、拡張計測機能イベント、推奨イベント、カスタムイベントという 4 つの主要なイベントタイプについて解説します。"
date: "2023-10-10"
tags:
  zh: ["數據分析", "MarTech", "數據轉型"]
  en: ["Data Analysis", "MarTech", "Data Transformation"]
  ja: ["データ分析", "MarTech", "データトランスフォーメーション"]
published: true
---

近期因為工作的關係開始大量接觸 Google Analytics，筆者主要負責 GA4 Data Mart 的設計以及雲端資料流的處理，希望能透過文章與各界 GA 使用者分享並交流數位軌跡的追蹤心得。

與通用 GA 不同，GA4 的分析結構以「事件」為基礎，其中 GA4 的事件又可分為**自動事件、加強型評估事件、建議事件**以及**自訂事件**等 4 大類，本文將逐個介紹並說明其中差異。

## 自動事件 (Automatically collected events)

以 Web 為例，GA4 的自動事件包括以下四項：
- **`user_engagement`**: 紀錄使用者離開或前往下一個網頁的時間
- **`session_start`**: 紀錄使用者的各個工作階段
- **`first_visit`**: 紀錄使用者初次造訪網頁的資訊
- **`page_view`**: 紀錄使用者瀏覽網頁的狀態

## 加強型評估事件 (Enhanced measurement events)

- **`file_download`**: 下載檔案
- **`click`**: 點擊外連 (Outbound) 連結
- **`scroll`**: 網頁滾動
- **`video_related`**: 觀看影片

## 建議事件 (Recommended events)

GA4 的建議事件是 Google 為不同產業所生成的推薦清單。

## 自訂事件 (Custom events)

顧名思義，自訂事件即 GA4 當中自由度最高的事件。

**Reference**
- [GA4] About events

<!-- en -->
# GA4 Event Guide | Digital Footprint

Unlike Universal Analytics, GA4 is built on an **Event-based** model. This guide explores the four core categories of events in GA4.

## 1. Automatically Collected Events
These include `session_start`, `first_visit`, and `page_view`. They are enabled by default as soon as the GA4 snippet is installed.

## 2. Enhanced Measurement
Advanced interactions like `scroll` (90% depth), `click` (outbound), and `file_download` can be toggled on within the GA4 admin interface without extra code.

## 3. Recommended & Custom Events
Recommended events are industry-specific templates (like `purchase` for retail), while Custom events offer full flexibility for unique business logic.

<!-- ja -->
# デジタル行動分析 | GA4イベントとは？

ユニバーサルアナリティクスと異なり、GA4は「イベント」を中心に設計されています。本記事では主要な4つのイベントカテゴリーを解説します。

## 1. 自動収集イベント
`first_visit` や `session_start` など、設定不要で自動的に記録されるイベントです。

## 2. 拡張計測機能イベント
スクロール、離脱クリック、サイト内検索など、管理画面でONにするだけで計測可能なイベントです。

## 3. 推奨およびカスタムイベント
Googleが推奨する業界別のイベントテンプレートと、独自のビジネスニーズに合わせて自由に定義できるカスタムイベントがあります。
