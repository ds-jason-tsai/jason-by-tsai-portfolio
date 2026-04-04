import Image from "next/image";
import { getDictionary } from '../dictionaries';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  const dict = await getDictionary(lang);

  return (
    <section className="hero" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div className="hero-content" style={{ maxWidth: '800px' }}>
        <h1 className="hero-title">
          {dict.home.title} <br />
          <span>{dict.home.subtitle}</span>
        </h1>
        <p className="hero-desc">
          {dict.home.description}
        </p>
        <a href={`/${lang}/contact`} className="btn-primary" style={{ display: 'inline-block', marginTop: '2rem' }}>{dict.home.cta}</a>
      </div>
    </section>
  );
}
