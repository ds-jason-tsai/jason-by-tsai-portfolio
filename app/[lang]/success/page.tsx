import Link from 'next/link';

export default async function SuccessPage({ searchParams, params }: { searchParams: Promise<{ session_id?: string, product?: string }>, params: Promise<{ lang: string }> }) {
  const lang = (await params).lang;
  const { session_id, product } = await searchParams;

  return (
    <section className="fade-in" style={{ padding: '8rem 2rem 5rem', textAlign: 'center', minHeight: '60vh' }}>
      <h1 className="section-title" style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--accent-color)' }}>
        Payment Successful!
      </h1>
      
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
        {lang === 'zh' 
          ? '感謝您的購買！您的交易已成功完成。' 
          : 'Thank you for your purchase! Your transaction was successful.'}
      </p>

      {session_id && (
        <div style={{ background: 'var(--glass-bg)', padding: '2rem', borderRadius: '15px', maxWidth: '600px', margin: '0 auto 3rem', border: '1px solid var(--glass-border)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            {lang === 'zh' ? '訂單識別碼 (Session ID):' : 'Order Session ID:'} <br/>
            <span style={{ color: 'var(--text-primary)', wordBreak: 'break-all' }}>{session_id}</span>
          </p>
          <a href="#" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
            {lang === 'zh' ? '📥 點此下載您的報告檔案' : '📥 Download Your Report File'}
          </a>
          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666' }}>
            * {lang === 'zh' ? '此為展示用按鈕。正式上線後將替換為有簽章的 Signed URL，確保檔案安全。' : 'This is a demo button. In production, this will be replaced with a signed secure URL.'}
          </p>
        </div>
      )}

      <Link href={`/${lang}/services`} className="media-action" style={{ display: 'inline-block', width: 'auto', padding: '0.8rem 2rem' }}>
         {lang === 'zh' ? '返回服務查看更多' : 'Return to Services'}
      </Link>
    </section>
  );
}
