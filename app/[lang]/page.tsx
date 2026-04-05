import Image from "next/image";
import { getDictionary } from '../dictionaries';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  const dict = await getDictionary(lang);

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          {dict.home.title} <br />
          <span>{dict.home.subtitle}</span>
        </h1>
        <p className="hero-desc">
          {dict.home.description}
        </p>
        
        <div className="hero-btns">
          <a href={`/${lang}/portfolio`} className="btn-primary">{dict.home.cta}</a>
          <a href={`/${lang}/contact`} className="btn-primary btn-secondary">
            {dict.home.contact_cta}
          </a>
        </div>

        {/* Social Presence / 導流區塊 */}
        <div className="social-links-section">
          <p className="social-label">
            Follow my Data Insights
          </p>
          <div className="social-icons">
            <a href="https://tw.linkedin.com/in/jasonb0604" target="_blank" rel="noopener noreferrer" className="social-icon-link">LinkedIn</a>
            <a href="https://www.instagram.com/chartbar0713/" target="_blank" rel="noopener noreferrer" className="social-icon-link">Instagram</a>
            <a href="https://medium.com/@jasonb0604" target="_blank" rel="noopener noreferrer" className="social-icon-link">Medium</a>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .hero {
            min-height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          .hero-content {
            max-width: 800px;
            width: 100%;
          }
          .hero-btns {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
            margin-top: 2rem;
            margin-bottom: 3rem;
          }
          .btn-secondary {
            background: transparent !important;
            border: 1px solid var(--accent-color) !important;
            color: var(--accent-color) !important;
          }
          .social-links-section {
            margin-top: 2rem;
          }
          .social-label {
            font-size: 0.9rem;
            color: var(--text-secondary);
            marginBottom: 1rem;
            textTransform: uppercase;
            letter-spacing: 2px;
          }
          .social-icons {
            display: flex;
            gap: 2rem;
            justify-content: center;
            align-items: center;
          }
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

          @media (max-width: 640px) {
            .hero-btns {
              flex-direction: column;
              gap: 1rem;
              padding: 0 1rem;
            }
            .social-icons {
              flex-direction: column;
              gap: 1.5rem;
            }
          }
        `}}/>
      </div>
    </section>
  );
}
