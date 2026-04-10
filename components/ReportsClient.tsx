'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import BuyButton from '../app/[lang]/components/BuyButton';

const reports = [
  {
    id: 'salesforce_se',
    category: 'report',
    image: '/images/case_study_sfse.png',
    title: {
      zh: '策略深探：Salesforce 解決方案工程架構與市場策略研究 (Case Study)',
      en: 'Strategic Case Study: Salesforce GTM & Solution Engineering Analysis',
      ja: '戦略的考察：Salesforce ソリューションエンジニアリングのフレームワークと市場参入戦略のケーススタディ',
    },
    description: {
      zh: '本案例研究深入解析全球 SaaS 領軍企業 Salesforce 的解決方案工程框架與市場進入策略。透過技術價值主張與顧問式銷售方法的深度研究，為專業人士提供高品質的商業分析與解決方案架構範本。適合數據分析師與技術顧問參考其商業敘事框架。',
      en: 'A comprehensive case study examining the solution engineering framework and go-to-market strategies of a Global SaaS leader. This research explores technical value propositioning and consultative selling methodology, providing a professional template for business storytelling and solution architecture.',
      ja: '世界的な SaaS リーダーである Salesforce のソリューションエンジニアリング体制と市場戦略を深く掘り下げたケーススタディ。技術的価値提案とコンサルティング・セールス手法の分析を通じて、専門家に高度なビジネスインサイトとソリューション構築のフレームワークを提供します。',
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
  {
    id: 'notebooklm_series',
    category: 'video',
    image: '/images/notebooklm_cover.jpg',
    title: {
      zh: 'NotebookLM 實戰應用：第一章 (全五章指南)',
      en: 'NotebookLM Applied: Chapter 1 (Ultimate Guide)',
      ja: 'NotebookLM活用術：第1章 (完全ガイド)',
    },
    description: {
      zh: '這是一套完整的 Google NotebookLM 專家級課程。從基礎介面、資料來源管理到高階 AI 對話技巧與創意工作坊，全方位解鎖 AI 對於個人知識管理與商業分析的強大潛力。',
      en: 'A comprehensive expert-level course on Google NotebookLM. Master core UI, source management, advanced AI collaboration, and creative workshops to unlock the full potential of AI.',
      ja: 'Google NotebookLMのエキスパート級講座。基本インターフェースから、多角的なソース管理、高度なAI對話テクニックまで、AIの可能性を最大限に引き出します。',
    },
    chapters: [
      { id: '1-1', zh: '1-1 認識講師', en: '1-1 Introduction', ja: '1-1 講師紹介' },
      { id: '1-2', zh: '1-2 介面認識與基本導航', en: '1-2 Interface & Navigation', ja: '1-2 ユーザーインターフェース' },
      { id: '1-3', zh: '1-3 來源導入 (PDF/網址/YT/雲端)', en: '1-3 Source Management', ja: '1-3 ソースのインポート' },
      { id: '1-4', zh: '1-4 對話與提示詞 (Prompt Engineering)', en: '1-4 Dialogue & Prompt Engineering', ja: '1-4 對話とプロンプト' },
      { id: '1-5', zh: '1-5 工作室 (語音/心智圖/報告生成)', en: '1-5 Creative Workshop', ja: '1-5 クリエイティブスタジオ' }
    ],
    price: 898,
    tags: ['#NotebookLM', '#GoogleAI', '#VideoCourse', '#Productivity'],
  },
  {
    id: 'notebooklm_ja_learning',
    category: 'video',
    image: '/images/notebooklm_cover.jpg',
    title: {
      zh: 'NotebookLM 實戰應用：第二章 (日語學習)',
      en: 'NotebookLM Applied: Chapter 2 (Japanese Learning)',
      ja: 'NotebookLM活用術：第2章 (日本語教育)',
    },
    description: {
      zh: '用 NotebookLM 打造專屬日語口說與聽力練習環境。透過 AI 模擬對話、文法解析與單字卡生成，讓個人知識庫成為您的 24 小時外語家教。',
      en: 'Create a Japanese learning environment with NotebookLM. Use AI for dialogue simulation and grammar analysis, transforming your knowledge base into an AI tutor.',
      ja: 'NotebookLMで自分専用の日本語學習環境を構築。AI對話、文法分析、單字卡生成を通じて、ナレッジベースを24時間の語學家庭教師に變えます。',
    },
    chapters: [
      { id: '2-1', zh: '2-1 日語學習夥伴(1)', en: '2-1 AI Japanese Partner (Pt.1)', ja: '2-1 日本語言學習夥伴 (Part 1)' },
      { id: '2-2', zh: '2-2 日語學習夥伴(2)', en: '2-2 AI Japanese Partner (Pt.2)', ja: '2-2 日本語言學習夥伴 (Part 2)' }
    ],
    price: 898,
    tags: ['#NotebookLM', '#JapaneseLearning', '#AIEducation', '#LanguageTips'],
  },
  {
    id: 'notebooklm_biz_analysis',
    category: 'video',
    image: '/images/notebooklm_cover.jpg',
    title: {
      zh: 'NotebookLM 實戰應用：第三章 (商業分析)',
      en: 'NotebookLM Applied: Chapter 3 (Business Analysis)',
      ja: 'NotebookLM活用術：第3章 (ビジネス分析)',
    },
    description: {
      zh: '結合 NotebookLM 深度解析市場趨勢與商業模型。學會將海量研究報告與競爭者資訊，快速轉化為精簡、高價值的決策洞察與策略藍圖。',
      en: 'Analyze trends and business models with NotebookLM. Learn to transform massive reports and competitor data into high-value strategic insights and blueprints.',
      ja: 'NotebookLMを驅使して市場動向とビジネスモデルを分析。大量の調査レポートや競合情報を、價値の高い策略的な洞察やロードマップに迅速に變換します。',
    },
    chapters: [
      { id: '3-1', zh: '3-1 商業分析工具(1)', en: '3-1 Business Analysis (Pt.1)', ja: '3-1 ビジネス分析ツール (Part 1)' },
      { id: '3-2', zh: '3-2 商業分析工具(2)', en: '3-2 Business Analysis (Pt.2)', ja: '3-2 ビジネス分析ツール (Part 2)' },
      { id: '3-3', zh: '3-3 商業分析工具(3)', en: '3-3 Business Analysis (Pt.3)', ja: '3-3 ビジネス分析ツール (Part 3)' }
    ],
    price: 898,
    tags: ['#NotebookLM', '#BusinessAnalysis', '#MarketResearch', '#Strategy'],
  },
  {
    id: 'notebooklm_chat_summary',
    category: 'video',
    image: '/images/notebooklm_cover.jpg',
    title: {
      zh: 'NotebookLM 實戰應用：第四章 (聊天摘要)',
      en: 'NotebookLM Applied: Chapter 4 (Chat Summary)',
      ja: 'NotebookLM活用術：第4章 (對話摘要)',
    },
    description: {
      zh: '運用 NotebookLM 快速梳理 LINE/WhatsApp 聊天紀錄。自動提取關鍵訊息、待辦清單與情感分析，解決群組對話斷層問題，提升社群營運效率。',
      en: 'Summarize LINE/WhatsApp logs with NotebookLM. Extract key messages, tasks, and sentiment to close dialogue gaps and boost social operations.',
      ja: 'NotebookLMでLINE/WhatsAppの履歴を整理。主要メッセージやタスク、感情分析を自動抽出し、グループ對話の斷絕を解消してコミュニティ運營を效率化します。',
    },
    chapters: [
      { id: '4-1', zh: '4-1 聊天紀錄摘要(1)', en: '4-1 Chat Summary (Pt.1)', ja: '4-1 對話要約 (Part 1)' },
      { id: '4-2', zh: '4-2 聊天紀錄摘要(2)', en: '4-2 Chat Summary (Pt.2)', ja: '4-2 對話要約 (Part 2)' },
      { id: '4-3', zh: '4-3 聊天紀錄摘要(3)', en: '4-3 Chat Summary (Pt.3)', ja: '4-3 對話要約 (Part 3)' }
    ],
    price: 898,
    tags: ['#NotebookLM', '#AIAssistant', '#ChatOps', '#SocialManagement'],
  },
  {
    id: 'notebooklm_finance_stock',
    category: 'video',
    image: '/images/notebooklm_cover.jpg',
    title: {
      zh: 'NotebookLM 實戰應用：第五章 (財報分析)',
      en: 'NotebookLM Applied: Chapter 5 (Finance Analysis)',
      ja: 'NotebookLM活用術：第5章 (投資分析)',
    },
    description: {
      zh: '第一手 NotebookLM 投資分析法。從上市櫃公司財報對標到新聞綜合評點，建立您的個人化 AI 投資領航員，從複雜數據中精準鎖定增長動能。',
      en: 'Innovative investment analysis using NotebookLM. From financial reports to news synthesis, build your AI navigator to spot growth in complex data.',
      ja: 'NotebookLMによる創新的な投資分析法。企業の財務諸表からニュースの統合評價まで、複雜な數據から成長性を的確に捉える個別的AI投資ナビゲーターを構築します。',
    },
    chapters: [
      { id: '4-4', zh: '4-4 財務報表、股票分析(1)', en: '4-4 Financial Analysis (Pt.1)', ja: '4-4 財務分析 (Part 1)' },
      { id: '4-5', zh: '4-5 財務報表、股票分析(2)', en: '4-5 Financial Analysis (Pt.2)', ja: '4-5 財務分析 (Part 2)' }
    ],
    price: 898,
    tags: ['#NotebookLM', '#FinanceAI', '#StockAnalysis', '#Investment'],
  },
];

export default function ReportsClient({ lang }: { lang: 'zh' | 'en' | 'ja' }) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'video' | 'report' | 'data'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      title: "分析レポート (Reports)・AI講座 (AI Courses)",
      desc: "ジェイソン・アナリティクス (Jason Analytics) が提供する獨占的な分析レポート、AI実務講座、および自動化ソリューション。高品質なビジネスインサイトと戦略フレームワークを即座に提供します。",
      categories: { all: "すべて", video: "動画講座", report: "ケーススタディ", data: "データセット" },
      badge: "獨占限定",
      chaptersLabel: "チャプターリスト",
      buyBtn: "💳 今すぐ購入",
      downloadLabel: "購入後に即座にアクセス可能",
    },
  };

  const t = content[lang];

  const filteredReports = activeCategory === 'all' 
    ? reports 
    : reports.filter(r => r.category === activeCategory);

  const total = filteredReports.length;

  const handleNext = () => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  // Safety check to prevent index out of bounds when total is 0
  if (total === 0) {
    return (
      <section className="portfolio premium-section fade-in" style={{ padding: '0 2rem' }}>
        <h1 className="section-title">{t.title}</h1>
        <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 3rem', lineHeight: '1.8' }}>
          {t.desc}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {(['all', 'video', 'report', 'data'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentIndex(0);
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
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)', background: 'var(--glass-bg)', borderRadius: '24px' }}>
          {lang === 'zh' ? '☕ 內容正在準備中，敬請期待！' : (lang === 'ja' ? '☕ コンテンツ準備中、お見逃しなく！' : '☕ Content coming soon, stay tuned!')}
        </div>
      </section>
    );
  }

  const currentBatch = isMobile || total <= 1
    ? [filteredReports[currentIndex]]
    : [filteredReports[currentIndex], filteredReports[(currentIndex + 1) % total]];

  return (
    <section className="portfolio premium-section fade-in" style={{ padding: '0 2rem' }}>
      <h1 className="section-title">{t.title}</h1>
      <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 3rem', lineHeight: '1.8' }}>
        {t.desc}
      </p>

      {/* Category Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {(['all', 'video', 'report', 'data'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setCurrentIndex(0);
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

      <div className="reports-outer-container" style={{ position: 'relative', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Mobile-Only Navigation (Centered Above) */}
        {isMobile && total > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <button onClick={handlePrev} className="carousel-nav-btn-mobile">‹</button>
            <button onClick={handleNext} className="carousel-nav-btn-mobile">›</button>
          </div>
        )}

        {/* Desktop Carousel Controls - Offset to -60px to match Portfolio */}
        {!isMobile && total > 1 && (
          <>
            <button className="carousel-control-standard prev" onClick={handlePrev} aria-label="Previous">‹</button>
            <button className="carousel-control-standard next" onClick={handleNext} aria-label="Next">›</button>
          </>
        )}

        {/* Physical Page Display (Zero Stutter Logic) */}
        <div className="reports-display-area" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '2rem', 
          minHeight: '840px',
          width: '100%',
          overflow: 'hidden'
        }}>
          {currentBatch.map((report, idx) => (
            <div
              key={`${report.id}-${currentIndex}-${idx}`}
              className="report-card"
              style={{ 
                flex: isMobile ? '0 0 100%' : '0 0 calc(50% - 1rem)',
                maxWidth: isMobile ? 'none' : '430px',
                display: 'flex', 
                flexDirection: 'column', 
                animation: 'slideUp 0.4s ease forwards',
                height: '880px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                background: 'rgba(255,255,255,0.02)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* 1. TOP - Fixed Image Container */}
              <div className="card-header-fixed" style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden', background: '#0a0a0f', borderRadius: '24px 24px 0 0', flexShrink: 0 }}>
                <Image
                  src={report.image}
                  alt={report.title[lang]}
                  fill
                  style={{ objectFit: 'contain', objectPosition: 'center', padding: '1rem' }}
                  className="report-img"
                />
                <div className="premium-badge-fixed">{t.badge}</div>
              </div>

              {/* 2. MIDDLE - Scrollable Content Body */}
              <div className="card-body-scrollable" style={{ 
                flex: 1, 
                overflowY: 'auto', 
                padding: '2rem 2.5rem', 
                background: 'rgba(255,255,255,0.02)',
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--accent-color) transparent'
              }}>
                <h3 style={{ 
                  fontSize: '1.4rem', 
                  fontWeight: '800', 
                  marginBottom: '1.5rem', 
                  color: '#fff', 
                  lineHeight: '1.5', 
                  minHeight: '4.5rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {report.title[lang]}
                </h3>
                
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '0.95rem', 
                  lineHeight: '1.8', 
                  marginBottom: '2rem', 
                  minHeight: '7.2rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {report.description[lang]}
                </p>

                {/* Chapters List */}
                {report.chapters && (
                  <div style={{ marginBottom: '2rem', padding: '1.2rem', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
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

                <div className="tags-container" style={{ marginBottom: '1rem' }}>
                  {report.tags.map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
              </div>

              {/* 3. BOTTOM - Fixed Footer */}
              <div className="card-footer-fixed" style={{ padding: '1.5rem 2.5rem 2.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0 0 24px 24px', flexShrink: 0 }}>
                <div className="price-action-vertical">
                  <div className="price-info-new">
                    <div className="price-val-big">NT${report.price}</div>
                    <div className="status-label-small">📥 {t.downloadLabel}</div>
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

        {/* Pagination Dots */}
        {total > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '3rem' }}>
            {filteredReports.map((_, i) => (
              <div 
                key={i} 
                onClick={() => setCurrentIndex(i)}
                style={{
                  width: i === currentIndex ? '35px' : '10px',
                  height: '10px',
                  borderRadius: '5px',
                  background: i === currentIndex ? 'var(--accent-color)' : 'rgba(255,255,255,0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0% { box-shadow: 0 0 5px rgba(0, 242, 254, 0.5), 0 0 10px rgba(0, 242, 254, 0.3); }
          50% { box-shadow: 0 0 20px rgba(79, 172, 254, 0.8), 0 0 30px rgba(0, 242, 254, 0.5); }
          100% { box-shadow: 0 0 5px rgba(0, 242, 254, 0.5), 0 0 10px rgba(0, 242, 254, 0.3); }
        }
        
        .card-body-scrollable::-webkit-scrollbar { width: 4px; }
        .card-body-scrollable::-webkit-scrollbar-thumb { background: var(--accent-color); border-radius: 10px; }

        .report-card:hover {
          transform: translateY(-8px);
          border-color: var(--accent-color) !important;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5), 0 0 30px rgba(0, 242, 254, 0.15);
        }
        
        .premium-badge-fixed {
          position: absolute; top: 20px; right: 20px;
          background: var(--accent-grad); color: #000;
          padding: 0.5rem 1.4rem; border-radius: 50px;
          font-size: 0.8rem; font-weight: 900;
          text-transform: uppercase; z-index: 10;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.4);
          animation: glowPulse 2s infinite ease-in-out;
        }

        .carousel-control-standard {
          position: absolute; top: 40%; transform: translateY(-50%);
          width: 60px; height: 60px; border-radius: 50%;
          background: rgba(0, 0, 0, 0.7); border: 1px solid rgba(0, 242, 254, 0.3);
          color: #fff; font-size: 2.2rem; display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 100;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .carousel-control-standard:hover { 
          background: var(--accent-color); color: #000; 
          box-shadow: 0 0 25px rgba(0, 242, 254, 0.6);
        }
        .carousel-control-standard.prev { left: -60px; }
        .carousel-control-standard.next { right: -60px; }
        
        .price-action-vertical {
          background: rgba(255, 255, 255, 0.04);
          padding: 1rem 1.2rem; border-radius: 20px;
          display: flex; flex-direction: column; gap: 0.8rem;
          align-items: center; justify-content: center;
        }
        .price-info-new {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
        }
        .price-val-big { font-size: 2rem; font-weight: 900; color: var(--accent-color); text-align: center; }
        .status-label-small { text-align: center; width: 100%; }

        @media (max-width: 1120px) {
           .carousel-control-standard.prev { left: -30px; }
           .carousel-control-standard.next { right: -30px; }
        }

        @media (max-width: 1024px) {
          .report-card { height: 800px !important; }
          .carousel-control-standard { width: 54px; height: 54px; font-size: 1.8rem; }
          .carousel-control-standard.prev { left: -10px; }
          .carousel-control-standard.next { right: -10px; }
        }
        
        @media (max-width: 768px) {
          .premium-section { padding: 0 0.5rem !important; }
          .report-card { 
            height: auto !important; 
            min-height: 750px; 
            border-radius: 0 !important; 
            border-left: none !important; 
            border-right: none !important;
            width: 100vw !important;
            margin: 0 !important;
          }
          
          .carousel-control-standard { display: none; }
          .mobile-only-nav { display: flex !important; }
          
          .carousel-nav-btn-mobile {
            width: 54px; height: 54px; border-radius: 50%;
            background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
            color: #fff; font-size: 2rem; display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: all 0.3s;
          }
          .carousel-nav-btn-mobile:active { background: var(--accent-color); color: #000; }
        }
      `}} />
    </section>
  );
}
