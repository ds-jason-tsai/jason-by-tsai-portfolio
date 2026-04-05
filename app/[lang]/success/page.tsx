import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  return {
    title: lang === 'zh' ? '購買成功 | 傑森數據' : lang === 'ja' ? '購入完了 | ジェイソン・アナリティクス' : 'Purchase Successful | Jason Tsai',
  };
}

// Google Drive download links — only shown after payment verification
const DOWNLOAD_LINKS: Record<string, string> = {
  salesforce_se: 'https://drive.google.com/file/d/1SCD4IGORxikCEXHALAP3zuUt5ArDnvkf/view?usp=sharing',
  report_1: '', // placeholder for future reports
};

const REPORT_NAMES: Record<string, Record<string, string>> = {
  salesforce_se: {
    zh: 'Case Study：Salesforce Solution Engineer',
    en: 'Case Study: Salesforce Solution Engineer Pitch',
    ja: 'ケーススタディ：Salesforce SE プレゼン',
  },
  report_1: {
    zh: '完整市場分析報告',
    en: 'Full Market Analytics Report',
    ja: '完全市場分析レポート',
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

  const driveUrl = product ? DOWNLOAD_LINKS[product] : '';
  const reportName = product ? (REPORT_NAMES[product]?.[lang] || REPORT_NAMES[product]?.['zh'] || product) : '';

  const t = {
    zh: {
      title: '🎉 付款成功！',
      subtitle: '感謝您的購買！您的專屬報告已準備完畢。',
      downloadTitle: '點擊下方按鈕立即下載：',
      downloadBtn: '📥 下載報告（Google Drive）',
      note: '此連結將在新分頁開啟 Google Drive 檔案。如遇問題請聯絡 Jason。',
      orderId: '訂單編號：',
      back: '返回報告列表',
      noLink: '下載連結準備中，請稍候或聯絡我們。',
    },
    en: {
      title: '🎉 Payment Successful!',
      subtitle: 'Thank you for your purchase! Your exclusive report is ready.',
      downloadTitle: 'Click the button below to download:',
      downloadBtn: '📥 Download Report (Google Drive)',
      note: 'This link will open the file in Google Drive in a new tab. Contact Jason if there are any issues.',
      orderId: 'Session ID: ',
      back: 'Back to Reports',
      noLink: 'Download link is being prepared. Please contact us.',
    },
    ja: {
      title: '🎉 お支払い完了！',
      subtitle: 'ご購入ありがとうございます！専用レポートの準備が整いました。',
      downloadTitle: '以下のボタンをクリックしてダウンロードしてください：',
      downloadBtn: '📥 レポートをダウンロード（Google Drive）',
      note: 'このリンクは新しいタブでGoogle Driveファイルを開きます。問題がある場合はJasonにご連絡ください。',
      orderId: 'セッションID：',
      back: 'レポート一覧に戻る',
      noLink: 'ダウンロードリンクを準備中です。お問い合わせください。',
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
          <p style={{ color: 'var(--accent-color)', fontWeight: '800', marginBottom: '0.75rem', fontSize: '1rem' }}>
            {reportName}
          </p>
        )}
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{t.downloadTitle}</p>

        {driveUrl ? (
          <>
            <a
              href={driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: 'inline-block', fontSize: '1rem', padding: '1rem 2.5rem' }}
            >
              {t.downloadBtn}
            </a>
            <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#666', lineHeight: '1.6' }}>
              {t.note}
            </p>
          </>
        ) : (
          <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>{t.noLink}</p>
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
