import ContactForm from './ContactForm';

import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { zh: "聯絡我 | 傑森數據", en: "Contact | Jason Tsai", ja: "お問い合わせ | ジェイソン・アナリティクス" };
  return { title: titles[lang as 'zh'|'en'|'ja'] || titles['zh'] };
}

export default async function Contact({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  
  const content = {
    zh: { title: "與我聯絡", subtitle: "準備好釋放數據的潛力了嗎？專案諮詢與報價請填寫下方表單。", desc: "請詳述您的特定需求或專案時程", name: "姓名", email: "電子郵件", msg: "專案需求細節", send: "發送訊息" },
    en: { title: "Get In Touch", subtitle: "Ready to unlock the power of your data? Connect with me today.", desc: "Please elaborate on your project needs or timeline.", name: "Name", email: "Email", msg: "Project Details / Message", send: "Send Message" },
    ja: { title: "お問い合わせ", subtitle: "データの力を解き放つ準備はできていますか？お気軽にご相談ください。", desc: "プロジェクトの特定のニーズやスケジュールを詳細にご記入ください。", name: "名前", email: "メール", msg: "プロジェクトの詳細", send: "送信する" }
  };
  const t = content[lang];

  return (
    <section className="contact fade-in" style={{ padding: '0 2rem' }}>
      <h2 className="section-title">{t.title}</h2>
      <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-secondary)' }}>{t.subtitle}</p>
      <div className="contact-card">
        <h3 className="service-title">{t.desc}</h3>
        <ContactForm t={t} />
      </div>
    </section>
  );
}
