'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import BuyButton from '../app/[lang]/components/BuyButton';

export default function ReportsClient({ lang }: { lang: 'zh' | 'en' | 'ja' }) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'video' | 'report' | 'data'>('all');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as any;
      if (['all', 'video', 'report', 'data'].includes(hash)) {
        setActiveCategory(hash);
      }
    }
  }, []);

  const content = {
    zh: {
      title: "付費專區",
      desc: "傑森數據 (Jason Tsai) 獨家分析報告、實務課程與數據包，提供高品質的商業洞察與技術框架。購買後可透過專屬連結下載或觀賞。",
      categories: { all: "全部內容", video: "影片課程", report: "實務報告", data: "原始數據" },
      badge: "獨家內容",
      chaptersLabel: "章節清單",
      buyBtn: "💳 立即解鎖",
      downloadLabel: "購買後可立即獲得存取權",
    },
    en: {
      title: "Premium Section",
      desc: "Exclusive analytical reports, video courses, and data assets by Jason Tsai. High-quality business insights and technical frameworks available instantly after purchase.",
      categories: { all: "All", video: "Video Courses", report: "Case Studies", data: "Raw Data" },
      badge: "Exclusive",
      chaptersLabel: "Chapter List",
      buyBtn: "💳 Unlock Now",
      downloadLabel: "Instant access after purchase",
    },
    ja: {
      title: "プレミアムエリア",
      desc: "シニアアナリスト Jason Tsai による独占分析レポートと実践的な動画講座。高品質なビジネスインサイトと戦略フレームワークを即座に提供します。",
      categories: { all: "すべて", video: "動画講座", report: "ケーススタディ", data: "データセット" },
      badge: "独占限定",
      chaptersLabel: "チャプターリスト",
      buyBtn: "💳 今すぐ購入",
      downloadLabel: "購入後に即座にアクセス可能",
    },
  };

  const t = content[lang];

  const reports = [
    {
      id: 'notebooklm_series',
      category: 'video',
      image: '/images/notebooklm_cover.jpg',
      title: {
        zh: 'Google NotebookLM：AI 專屬知識庫完全指南 (全五章)',
        en: 'Google NotebookLM: The Ultimate AI Knowledge Base Guide (Full Course)',
        ja: 'Google NotebookLM完全ガイド：AIナレッジベース構築 (全5章)',
      },
      description: {
        zh: '這是一套完整的 Google NotebookLM 專家級課程。從基礎介面、資料來源管理到高階 AI 對話技巧與創意工作坊，全方位解鎖 AI 對於個人知識管理與商業分析的強大潛力。',
        en: 'A comprehensive expert-level course on Google NotebookLM. Master core UI, source management, advanced AI collaboration, and creative workshops to unlock the full potential of AI.',
        ja: 'Google NotebookLMのエキスパート級講座。基本インターフェースから、多角的なソース管理、高度なAI対話テクニックまで、AIの可能性を最大限に引き出します。',
      },
      chapters: [
        { id: '1-1', zh: '1-1 認識講師', en: '1-1 Introduction', ja: '1-1 講師紹介' },
        { id: '1-2', zh: '1-2 介面認識與基本導航', en: '1-2 Interface & Navigation', ja: '1-2 ユーザーインターフェース' },
        { id: '1-3', zh: '1-3 來源導入 (PDF/網址/YT/雲端)', en: '1-3 Source Management', ja: '1-3 ソースのインポート' },
        { id: '1-4', zh: '1-4 對話與提示詞 (Prompt Engineering)', en: '1-4 Dialogue & Prompt Engineering', ja: '1-4 対話とプロンプト' },
        { id: '1-5', zh: '1-5 工作室 (語音/心智圖/報告生成)', en: '1-5 Creative Workshop', ja: '1-5 クリエイティブスタジオ' }
      ],
      price: 898,
      tags: ['#NotebookLM', '#GoogleAI', '#VideoCourse', '#Productivity'],
    },
    {
      id: 'salesforce_se',
      category: 'report',
      image: '/images/salesforce_cover.png',
      title: {
        zh: 'Case Study：Salesforce Solution Engineer Pitch Deck',
        en: 'Case Study: Salesforce Solution Engineer Pitch Deck',
        ja: 'ケーススタディ：Salesforce SE プレゼン',
      },
      description: {
        zh: '專業 C-level 提案簡報：包含執行摘要、痛點剖析、技術架構 (Einstein AI) 與行動計畫。適合數據分析師與技術顧問參考其商業敘事框架。',
        en: 'A professional C-level pitch deck. Covers pain points, technical architecture (Einstein AI), and action plan. A perfect reference for business storytelling.',
        ja: 'プロのCレベル向けプレゼン。Einstein AIを中心とした技術アーキテクチャ、ビジネス上の課題、アクションプランを網羅したピッチデッキです。',
      },
      chapters: [
        { id: '1', zh: '執行摘要與專案影響 (Executive Summary)', en: 'Executive Summary', ja: 'エグゼクティブサマリー' },
        { id: '2', zh: '商業痛點剖析 (Pain Points Analysis)', en: 'Pain Points Analysis', ja: '課題分析' },
        { id: '3', zh: '技術架構與解決方案 (Einstein AI)', en: 'Technical Architecture & Einstein AI', ja: '技術アーキテクチャ (Einstein AI)' },
        { id: '4', zh: '投資回報與財務效益分析 (ROI Justification)', en: 'Financial Justification & ROI', ja: '投資対効果分析 (ROI)' },
        { id: '5', zh: '導入途徑與行動計畫 (Roadmap & Action Plan)', en: 'Roadmap & Action Plan', ja: '導入ロードマップ' }
      ],
      price: 498,
      tags: ['#Salesforce', '#SolutionEngineer', '#C-Level', '#BusinessPresentation'],
    },
  ];

  const filteredReports = activeCategory === 'all' 
    ? reports 
    : reports.filter(r => r.category === activeCategory);

  return (
    <section className="portfolio fade-in" style={{ padding: '0 2rem' }}>
      <h2 className="section-title">{t.title}</h2>
      <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 3rem', lineHeight: '1.8' }}>
        {t.desc}
      </p>

      {/* Category Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
        {(['all', 'video', 'report', 'data'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              window.history.pushState(null, '', `#${cat}`);
            }}
            style={{
              padding: '0.6rem 2rem',
              borderRadius: '50px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: activeCategory === cat ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
              color: activeCategory === cat ? '#000' : '#fff',
              fontSize: '0.9rem',
              fontWeight: activeCategory === cat ? '800' : '500',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            className="category-btn"
          >
            {t.categories[cat]}
          </button>
        ))}
      </div>

      <div className="reports-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 450px))', 
        gap: '3rem', 
        justifyContent: 'center', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        {filteredReports.map((report, idx) => (
          <div
            key={report.id}
            className="report-card"
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              animation: `slideUp 0.6s ease forwards ${idx * 0.1}s`,
              opacity: 0
            }}
          >
            {/* Image */}
            <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden', background: '#0a0a0f', borderRadius: '24px 24px 0 0' }}>
              <Image
                src={report.image}
                alt={report.title[lang]}
                fill
                style={{ objectFit: 'contain', objectPosition: 'center', padding: '1rem' }}
                className="report-img"
              />
              <div className="premium-badge">{t.badge}</div>
            </div>

            {/* Content Body */}
            <div style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0 0 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.2rem', color: '#fff', minHeight: '3.5rem', display: 'flex', alignItems: 'center' }}>
                {report.title[lang]}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.8', marginBottom: '2rem', minHeight: '6.5rem' }}>
                {report.description[lang]}
              </p>

              {/* Chapters List (Timeline appearance) */}
              {report.chapters && (
                <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: '900', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '2px' }}>
                    {t.chaptersLabel}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {report.chapters.map((ch, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-color)', opacity: 0.8 }}></div>
                        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{(ch as any)[lang]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="tags-container" style={{ margin: 'auto 0 2rem' }}>
                {report.tags.map((tag, i) => (
                  <span key={i} className="tag" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', padding: '0.2rem 0.6rem', fontSize: '0.75rem', borderRadius: '4px' }}>{tag}</span>
                ))}
              </div>

              <div className="price-action-container">
                <div className="price-info">
                  <div className="price-label">PREMIUM VALUE</div>
                  <div className="price-val">NT${report.price}</div>
                  <div className="status-label">📥 {t.downloadLabel}</div>
                </div>
                <BuyButton
                  reportId={report.id}
                  lang={lang}
                  buttonText={t.buyBtn}
                  price={report.price}
                  productName={report.title[lang]}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }
        .report-card {
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          transition: all 0.4s ease;
        }
        .report-card:hover {
          transform: translateY(-10px);
          border-color: var(--accent-color);
          box-shadow: 0 30px 60px rgba(0,0,0,0.5), 0 0 30px rgba(0, 242, 254, 0.1);
        }
        .premium-badge {
          position: absolute; top: 20px; right: 20px;
          background: var(--accent-grad); color: #000;
          padding: 0.4rem 1.2rem; border-radius: 50px;
          font-size: 0.7rem; font-weight: 900;
          text-transform: uppercase; z-index: 2;
        }
        .category-btn:hover {
          box-shadow: 0 0 20px rgba(0, 242, 254, 0.2);
          transform: scale(1.05);
        }
        .price-action-container {
          background: rgba(255, 255, 255, 0.03);
          padding: 1.5rem; border-radius: 20px;
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
        }
        .price-label { font-size: 0.6rem; color: var(--text-secondary); letter-spacing: 1px; }
        .price-val { font-size: 1.8rem; font-weight: 900; color: var(--accent-color); }
        .status-label { font-size: 0.7rem; color: rgba(255,255,255,0.4); margin-top: 4px; }
        @media (max-width: 768px) {
          .portfolio { padding: 0 0.5rem !important; }
          .section-title { font-size: 2.2rem !important; }
          .reports-grid { gap: 1.5rem !important; }
          .report-card > div:last-child { padding: 1.5rem !important; }
          .price-action-container { 
            padding: 1.2rem !important; 
            flex-direction: column; 
            align-items: center; 
            text-align: center;
          }
          .price-info { margin-bottom: 1rem; }
        }
      `}} />
    </section>
  );
}
