import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { 
    zh: "付款失敗 | 傑森數據 Jason Analytics", 
    en: "Payment Failed | Jason Analytics", 
    ja: "お支払い失敗 | ジェイソン・アナリティクス" 
  };
  return { 
    title: titles[lang as 'zh'|'en'|'ja'] || titles['zh'],
    robots: { index: false, follow: false }
  };
}

export default async function FailedPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ msg?: string }>;
  params: Promise<{ lang: string }>;
}) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  const sParams = await searchParams;
  const errorMsg = sParams.msg || '';

  const t = {
    zh: {
      title: '⚠️ 付款未能完成',
      subtitle: '很抱歉，您的刷卡授權未能順利完成，系統尚未進行扣款。',
      reason: '失敗原因：',
      advice: '這可能是因為 Apple Pay 授權逾時、信用卡額度不足或網路連線不穩。請您重新嘗試結帳，或更換其他信用卡再次購買。',
      retryBtn: '🔄 返回付費專區重新購買',
      contactBtn: '💬 聯絡客服求助',
    },
    en: {
      title: '⚠️ Payment Failed',
      subtitle: 'Sorry, your payment authorization could not be completed and you have not been charged.',
      reason: 'Reason: ',
      advice: 'This could be due to an Apple Pay timeout, insufficient funds, or a network issue. Please try again or use a different credit card.',
      retryBtn: '🔄 Return to Shop to Try Again',
      contactBtn: '💬 Contact Support',
    },
    ja: {
      title: '⚠️ お支払い失敗',
      subtitle: '申し訳ありませんが、お支払いの承認が完了しなかったため、請求は発生していません。',
      reason: 'エラー理由：',
      advice: 'Apple Payのタイムアウト、残高不足、またはネットワークの問題の可能性があります。もう一度お試しいただくか、別のクレジットカードをご利用ください。',
      retryBtn: '🔄 ショップに戻って再試行',
      contactBtn: '💬 サポートに連絡',
    },
  }[lang];

  return (
    <section className="fade-in" style={{ padding: '6rem 2rem 5rem', textAlign: 'center', minHeight: '70vh' }}>
      {/* Error Icon */}
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', margin: '0 auto 2rem', fontSize: '2.5rem', color: '#fff',
        boxShadow: '0 0 20px rgba(255, 65, 108, 0.4)'
      }}>
        !
      </div>

      <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem', color: '#fff' }}>{t.title}</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1.5rem', maxWidth: '560px', margin: '0 auto 1.5rem' }}>
        {t.subtitle}
      </p>

      {/* Error Details Card */}
      <div style={{
        background: 'rgba(255, 65, 108, 0.05)',
        border: '1px solid rgba(255, 65, 108, 0.2)',
        borderRadius: '20px',
        padding: '2rem',
        maxWidth: '560px',
        margin: '0 auto 3rem',
      }}>
        {errorMsg && (
          <p style={{ color: '#ff4b2b', fontWeight: '800', marginBottom: '1rem', fontSize: '1.05rem', wordBreak: 'break-word' }}>
            {t.reason}{errorMsg}
          </p>
        )}
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7' }}>
          {t.advice}
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
        <Link href={`/${lang}/reports`} className="btn-primary" style={{ padding: '0.8rem 2rem', width: '100%', maxWidth: '320px' }}>
          {t.retryBtn}
        </Link>
        <Link href={`/${lang}/contact`} className="media-action" style={{ display: 'inline-block', width: '100%', maxWidth: '320px', padding: '0.8rem 2rem', background: 'rgba(255,255,255,0.05)' }}>
          {t.contactBtn}
        </Link>
      </div>
    </section>
  );
}
