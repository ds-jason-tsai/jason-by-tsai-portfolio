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

// Google Drive download links — only shown after payment verification
const ACCESS_LINKS: Record<string, string | string[]> = {
  salesforce_se: 'https://drive.google.com/file/d/1SCD4IGORxikCEXHALAP3zuUt5ArDnvkf/view?usp=sharing',
  notebooklm_series: 'https://www.youtube.com/playlist?list=PL-placeholder',
  notebooklm_ja_learning: ['https://youtu.be/HSc-2-7IW_g', 'https://youtu.be/hIlwYCoewn0'],
  notebooklm_biz_analysis: ['https://youtu.be/aS2CpZpC4xI', 'https://youtu.be/BovFYbX4nKQ', 'https://youtu.be/lJpxm62QjDg'],
  notebooklm_chat_summary: ['https://youtu.be/mH4wzr-ZWR8', 'https://youtu.be/RK1OkD_BnPg', 'https://youtu.be/LJQOwYdljE8'],
  notebooklm_finance_stock: ['https://youtu.be/MZ6DV3t54Rg', 'https://youtu.be/wYv7jhoI1nc'],
};

const REPORT_NAMES: Record<string, Record<string, string>> = {
  salesforce_se: {
    zh: 'Case Study：Salesforce Solution Engineer',
    en: 'Case Study: Salesforce Solution Engineer Pitch',
    ja: 'ケーススタディ：Salesforce SE プレゼン',
  },
  notebooklm_series: {
    zh: 'NotebookLM 知識庫完全指南',
    en: 'NotebookLM Ultimate Guide',
    ja: 'NotebookLM完全ガイド',
  },
  notebooklm_ja_learning: {
    zh: 'NotebookLM x 日語學習夥伴',
    en: 'NotebookLM x Japanese Partner',
    ja: 'NotebookLM x 日本語学習',
  },
  notebooklm_biz_analysis: {
    zh: 'NotebookLM x 商業分析工具',
    en: 'NotebookLM x Biz Analysis',
    ja: 'NotebookLM x ビジネス分析',
  },
  notebooklm_chat_summary: {
    zh: 'NotebookLM x 聊天紀錄 AI 摘要',
    en: 'NotebookLM x Chat Log Summary',
    ja: 'NotebookLM x チャット要約',
  },
  notebooklm_finance_stock: {
    zh: 'NotebookLM x 財務報表、股票分析',
    en: 'NotebookLM x Finance & Stock',
    ja: 'NotebookLM x 財務・株価分析',
  },
};

export default async function SuccessPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ session_id?: string; product?: string }>;
  params: Promise<{ lang: string }>;
}) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  const { session_id, product } = await searchParams;

  const accessData = product ? ACCESS_LINKS[product] : '';
  const reportName = product ? (REPORT_NAMES[product]?.[lang] || REPORT_NAMES[product]?.['zh'] || product) : '';

  const t = {
    zh: {
      title: '🎉 付款成功！',
      subtitle: '感謝您的購買！您的專屬內容已準備完畢。',
      downloadTitle: '請點擊下方連結開始：',
      downloadBtn: '📥 下載報告 (Google Drive)',
      watchBtn: '📺 觀看影片 (YouTube)',
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
      note: '新しいタブで開きます。問題がある場合はJasonにご連絡ください。',
      orderId: '注文ID：',
      back: '戻る',
      noLink: '準備中です。お問い合わせください。',
    },
  }[lang];

  const renderLink = (url: string, index?: number) => {
    const isYouTube = url.includes('youtu.be') || url.includes('youtube.com');
    const label = isYouTube ? t.watchBtn : t.downloadBtn;
    const suffix = index !== undefined ? ` (${index + 1})` : '';

    return (
      <a
        key={url}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
        style={{ 
          display: 'inline-block', 
          fontSize: '0.9rem', 
          padding: '0.8rem 1.8rem',
          margin: '0.5rem'
        }}
      >
        {label}{suffix}
      </a>
    );
  };

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

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
          {accessData ? (
            Array.isArray(accessData) 
              ? accessData.map((url, i) => renderLink(url, i))
              : renderLink(accessData)
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>{t.noLink}</p>
          )}
        </div>

        {accessData && (
          <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#666', lineHeight: '1.6' }}>
            {t.note}
          </p>
        )}

        {session_id && (
          <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#444', wordBreak: 'break-all' }}>
            {t.orderId}<span style={{ color: '#666' }}>{session_id}</span>
          </p>
        )}
      </div>

      <Link href={`/${lang}/reports`} className="media-action" style={{ display: 'inline-block', width: 'auto', padding: '0.8rem 2rem' }}>
        {t.back}
      </Link>
    </section>
  );
}
