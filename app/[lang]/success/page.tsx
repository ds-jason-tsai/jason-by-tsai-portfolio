import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { 
    zh: "購買成功 | 傑森數據 Jason Analytics", 
    en: "Purchase Successful | Jason Analytics", 
    ja: "購入完了 | ジェイソン・アナリティクス" 
  };
  return { 
    title: titles[lang as 'zh'|'en'|'ja'] || titles['zh'],
    robots: { index: false, follow: false } // Best practice for payment success pages
  };
}

// Google Drive & Sheets links — only shown after payment verification
const ACCESS_LINKS: Record<string, (string | { url: string; label?: string })[]> = {
  salesforce_se: [{ url: 'https://drive.google.com/file/d/1SCD4IGORxikCEXHALAP3zuUt5ArDnvkf/view?usp=sharing', label: '📊 下載報告 (Direct Link)' }],
  notebooklm_series: [
    { label: '1-1 認識講師', url: 'https://youtu.be/OBRw2ysakaI' },
    { label: '1-2 介面認識與基本導航', url: 'https://youtu.be/ByYtZNufMrM' },
    { label: '1-3 來源導入 (PDF/網址/YT/雲端)', url: 'https://youtu.be/G1IbkIMnhuA' },
    { label: '1-4 對話與提示詞 (Prompt Engineering)', url: 'https://youtu.be/ByP3FcIh0eA' },
    { label: '1-5 工作室 (語音/心智圖/報告生成)', url: 'https://youtu.be/W6qxsRyeGkI' }
  ],
  notebooklm_ja_learning: [
    { label: '2-1 日語學習夥伴(1)', url: 'https://youtu.be/HSc-2-7IW_g' },
    { label: '2-2 日語學習夥伴(2)', url: 'https://youtu.be/hIlwYCoewn0' }
  ],
  notebooklm_biz_analysis: [
    { label: '3-1 商業分析工具(1)', url: 'https://youtu.be/aS2CpZpC4xI' },
    { label: '3-2 商業分析工具(2)', url: 'https://youtu.be/BovFYbX4nKQ' },
    { label: '3-3 商業分析工具(3)', url: 'https://youtu.be/lJpxm62QjDg' }
  ],
  notebooklm_chat_summary: [
    { label: '4-1 聊天紀錄摘要(1)', url: 'https://youtu.be/mH4wzr-ZWR8' },
    { label: '4-2 聊天紀錄摘要(2)', url: 'https://youtu.be/RK1OkD_BnPg' },
    { label: '4-3 聊天紀錄摘要(3)', url: 'https://youtu.be/LJQOwYdljE8' }
  ],
  notebooklm_finance_stock: [
    { label: '4-4 財務報表、股票分析(1)', url: 'https://youtu.be/MZ6DV3t54Rg' },
    { label: '4-5 財務報表、股票分析(2)', url: 'https://youtu.be/wYv7jhoI1nc' }
  ],
};

const REPORT_NAMES: Record<string, Record<string, string>> = {
  salesforce_se: {
    zh: 'SaaS 策略深探：Salesforce 解決方案工程與 GTM 研究 (Case Study)',
    en: 'Strategic Case Study: Salesforce GTM & SE Framework',
    ja: '戦略的考察：Salesforce SE と GTM 分析 (Case Study)',
  },
  notebooklm_series: {
    zh: 'NotebookLM 實戰應用：第一章 (全五章指南)',
    en: 'NotebookLM Applied: Chapter 1 (Ultimate Guide)',
    ja: 'NotebookLM活用術：第1章 (完全ガイド)',
  },
  notebooklm_ja_learning: {
    zh: 'NotebookLM 實戰應用：第二章 (日語學習)',
    en: 'NotebookLM Applied: Chapter 2 (Japanese Learning)',
    ja: 'NotebookLM活用術：第2章 (日本語教育)',
  },
  notebooklm_biz_analysis: {
    zh: 'NotebookLM 實戰應用：第三章 (商業分析)',
    en: 'NotebookLM Applied: Chapter 3 (Business Analysis)',
    ja: 'NotebookLM活用術：第3章 (ビジネス分析)',
  },
  notebooklm_chat_summary: {
    zh: 'NotebookLM 實戰應用：第四章 (聊天摘要)',
    en: 'NotebookLM Applied: Chapter 4 (Chat Summary)',
    ja: 'NotebookLM活用術：第4章 (對話摘要)',
  },
  notebooklm_finance_stock: {
    zh: 'NotebookLM 實戰應用：第五章 (財報分析)',
    en: 'NotebookLM Applied: Chapter 5 (Finance Analysis)',
    ja: 'NotebookLM活用術：第5章 (投資分析)',
  },
};

export default async function SuccessPage({
    searchParams,
  params,
}: {
  searchParams: Promise<{ 
    session_id?: string; 
    product?: string; 
    id?: string; 
    CustomField1?: string; 
    MerchantTradeNo?: string 
  }>;
  params: Promise<{ lang: string }>;
}) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  const sParams = await searchParams;
  
  // 優先從多個來源獲取產品 ID (product, id, 或綠界回傳的 CustomField1)
  const productId = sParams.product || sParams.id || sParams.CustomField1 || '';
  const orderId = sParams.session_id || sParams.MerchantTradeNo || '';

  const accessData = productId ? ACCESS_LINKS[productId] : '';
  const reportName = productId ? (REPORT_NAMES[productId]?.[lang] || REPORT_NAMES[productId]?.['zh'] || productId) : '';

  const t = {
    zh: {
      title: '🎉 付款成功！',
      subtitle: '感謝您的購買！您的專屬內容已準備完畢。',
      downloadTitle: '請點擊下方連結開始：',
      downloadBtn: '📥 下載報告 (Google Drive)',
      watchBtn: '📺 觀看影片 (YouTube)',
      tableBtn: '📊 工具表格 (Google Sheets)',
      tableName: '內容名稱',
      tableUrl: '播放連結 / 下載網址',
      note: '連結將在新分頁開啟。如遇問題請聯絡 Jason。',
      orderId: '訂單編號：',
      back: '返回列表',
      noLink: '連結準備中，請稍候或聯絡我們。',
    },
    en: {
      title: '🎉 Payment Successful!',
      subtitle: 'Thank you! Your exclusive content is ready.',
      downloadTitle: 'Click the links below to start:',
      downloadBtn: '📥 Download (Drive)',
      watchBtn: '📺 Watch Now (YouTube)',
      tableBtn: '📊 Tool Sheet (Google Sheets)',
      tableName: 'Name',
      tableUrl: 'Link',
      note: 'Links will open in a new tab. Contact Jason for issues.',
      orderId: 'Order ID: ',
      back: 'Back',
      noLink: 'Preparing link. Please contact us.',
    },
    ja: {
      title: '🎉 お支払い完了！',
      subtitle: 'ご購入ありがとうございます！コンテンツの準備が整いました。',
      downloadTitle: '以下のリンクをクリックしてください：',
      downloadBtn: '📥 ダウンロード',
      watchBtn: '📺 動画を視聴',
      tableBtn: '📊 ツール一覧 (Google Sheets)',
      tableName: '項目名',
      tableUrl: 'リンク',
      note: '新しいタブで開きます。問題がある場合はJasonにご連絡ください。',
      orderId: '注文ID：',
      back: '戻る',
      noLink: '準備中です。お問い合わせください。',
    },
  }[lang];

  return (
    <section className="fade-in" style={{ padding: '6rem 2rem 5rem', textAlign: 'center', minHeight: '70vh' }}>
      {/* Success Icon */}
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        background: 'var(--accent-grad)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', margin: '0 auto 2rem', fontSize: '2.5rem',
      }}>
        ✓
      </div>

      <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>{t.title}</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '3rem', maxWidth: '560px', margin: '0 auto 3rem' }}>
        {t.subtitle}
      </p>

      {/* Download Card */}
      <div style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: '20px',
        padding: '2.5rem 2rem',
        maxWidth: '600px',
        margin: '0 auto 3rem',
      }}>
        {reportName && (
          <p style={{ color: 'var(--accent-color)', fontWeight: '800', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
            {reportName}
          </p>
        )}
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{t.downloadTitle}</p>
        
        <div style={{ overflowX: 'auto', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: '900', textTransform: 'uppercase' }}>{t.tableName}</th>
                <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: '900', textTransform: 'uppercase' }}>{t.tableUrl}</th>
              </tr>
            </thead>
            <tbody>
              {accessData && Array.isArray(accessData) ? (
                accessData.map((linkInfo, i) => {
                  const url = typeof linkInfo === 'string' ? linkInfo : linkInfo.url;
                  const customLabel = typeof linkInfo === 'string' ? `${t.watchBtn} ${i+1}` : linkInfo.label;
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#fff' }}>{customLabel}</td>
                      <td style={{ padding: '1rem' }}>
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ color: 'var(--accent-color)', fontSize: '0.85rem', textDecoration: 'underline', wordBreak: 'break-all' }}
                        >
                          {url}
                        </a>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={2} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    {t.noLink}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {accessData && (
          <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#666', lineHeight: '1.6' }}>
            {t.note}
          </p>
        )}

        {orderId && (
          <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#444', wordBreak: 'break-all' }}>
            {t.orderId}<span style={{ color: '#666' }}>{orderId}</span>
          </p>
        )}
      </div>

      <Link href={`/${lang}/reports`} className="media-action" style={{ display: 'inline-block', width: 'auto', padding: '0.8rem 2rem' }}>
        {t.back}
      </Link>
    </section>
  );
}
