import ContactForm from './ContactForm';

import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { 
    zh: "預約顧問與聯絡傑森 | 傑森數據 Jason Analytics", 
    en: "Consultation & Contact | Jason Analytics", 
    ja: "お問い合わせ・無料相談 (Contact) | ジェイソン・アナリティクス" 
  };
  const descriptions = {
    zh: "歡迎聯絡傑森數據 Jason Analytics 諮詢數據分析、AI 建模或 MarTech 行銷科技顧問合作項目。無論是企業端數據自動化流程優化、Python 與 SQL 專案開發，還是您個人的數據分析師職涯轉職建議，我都將為您提供最專業的實戰見解與客製化解決方案。立即填寫表單與我連繫，讓我們一起釋放數據的潛力。",
    en: "Contact Jason Analytics (Jason Tsai) for professional data analysis, AI modeling, or MarTech consulting. Whether it's enterprise automation, Python/SQL engineering, or data career coaching, I provide expert insights and customized solutions to unlock your data's full potential.",
    ja: "Jason Analytics (ジェイソン・ツァイ) へのデータ分析、AIモデリング、MarTech 顧問のご相談はこちら。業務自動化の最適化から Python/SQL 開発、データアナリストとしてのキャリア相談まで、専門的な知見を提供します。お問い合わせフォームからお気軽にご連絡ください。あなたのビジネスにデータの力を。"
  };
  return { 
    title: titles[lang as 'zh'|'en'|'ja'] || titles['zh'],
    description: descriptions[lang as 'zh'|'en'|'ja'] || descriptions['zh'],
    alternates: {
      canonical: `https://jason-by-tsai-portfolio.vercel.app/${lang}/contact`,
      languages: {
        'zh': 'https://jason-by-tsai-portfolio.vercel.app/zh/contact',
        'en': 'https://jason-by-tsai-portfolio.vercel.app/en/contact',
        'ja': 'https://jason-by-tsai-portfolio.vercel.app/ja/contact',
      },
    }
  };
}

export default async function Contact({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  
  const content = {
    zh: { title: "與我聯絡", subtitle: "準備好釋放數據的潛力了嗎？專案諮詢與報價請填寫下方表單。", desc: "請詳述您的特定需求或專案時程", name: "姓名", email: "電子郵件", msg: "專案需求細節", send: "發送訊息" },
    en: { title: "Get In Touch", subtitle: "Ready to unlock the power of your data? Connect with me today.", desc: "Please elaborate on your project needs or timeline.", name: "Name", email: "Email", msg: "Project Details / Message", send: "Send Message" },
    ja: { title: "お問い合わせ (Contact)", subtitle: "データ分析、AI活用、MarTech導入に関するご相談はこちらから。あなたのビジネスにデータの力を解き放つ準備はできていますか？", desc: "プロジェクトの特定のニーズ、課題、またはスケジュールを詳細にご記入ください。", name: "名前", email: "メール", msg: "プロジェクトの詳細 / 相談内容", send: "送信する" }
  };
  const t = content[lang];

  return (
    <section className="contact fade-in" style={{ padding: '0 2rem' }}>
      <h1 className="section-title" id="contact-title">{t.title}</h1>
      <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-secondary)' }}>{t.subtitle}</p>
      <div className="contact-card">
        <h3 className="service-title">{t.desc}</h3>
        <ContactForm t={t} />
      </div>
    </section>
  );
}
