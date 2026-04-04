import Image from "next/image";
import { getDictionary } from '../dictionaries';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  const dict = await getDictionary(lang);

  return (
    <section className="hero" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div className="hero-content" style={{ maxWidth: '800px' }}>
        <h1 className="hero-title">
          {dict.home.title} <br />
          <span>{dict.home.subtitle}</span>
        </h1>
        <p className="hero-desc">
          {dict.home.description}
        </p>
        
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '2rem', marginBottom: '3rem' }}>
          <a href={`/${lang}/portfolio`} className="btn-primary">{dict.home.cta}</a>
          <a href={`/${lang}/contact`} className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)' }}>
            {dict.home.contact_cta}
          </a>
        </div>

        {/* Social Presence / 導流區塊 */}
        <div className="social-links" style={{ marginTop: '2rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Follow my Data Insights
          </p>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center' }}>
            <a href="https://tw.linkedin.com/in/jasonb0604" target="_blank" rel="noopener noreferrer" className="social-icon-link">LinkedIn</a>
            <a href="https://www.instagram.com/chartbar0713/" target="_blank" rel="noopener noreferrer" className="social-icon-link">Instagram</a>
            <a href="https://medium.com/@jasonb0604" target="_blank" rel="noopener noreferrer" className="social-icon-link">Medium</a>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .social-icon-link {
            color: var(--text-primary);
            text-decoration: none;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            position: relative;
          }
          .social-icon-link:hover {
            color: var(--accent-color);
            transform: translateY(-2px);
          }
          .social-icon-link::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0;
            height: 2px;
            background: var(--accent-grad);
            transition: width 0.3s ease;
          }
          .social-icon-link:hover::after {
            width: 100%;
          }
        `}}/>
      </div>
    </section>
  );
}
