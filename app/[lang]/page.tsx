import Image from "next/image";
import { getDictionary } from '../dictionaries';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  const dict = await getDictionary(lang);

  return (
    <section className="hero" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="hero-content">
        <h1 className="hero-title">
          {dict.home.title} <br />
          <span>{dict.home.subtitle}</span>
        </h1>
        <p className="hero-desc">
          {dict.home.description}
        </p>
        <a href={`/${lang}/contact`} className="btn-primary">{dict.home.cta}</a>
      </div>
      <div className="hero-image-container">
        <Image 
          src="/profile.jpg" 
          alt="Jason Tsai" 
          width={400} 
          height={400} 
          className="hero-image"
          priority
        />
      </div>
    </section>
  );
}
