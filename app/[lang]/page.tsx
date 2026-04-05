import Image from "next/image";
import { getDictionary } from '../dictionaries';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  const dict = await getDictionary(lang);

  return (
    <>
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
        </div>

        <div className="hero-image-container">
          <Image 
            src="/images/Jason6.jpg" 
            alt="Jason Tsai" 
            width={350} 
            height={350} 
            className="hero-image"
            style={{ objectPosition: 'top', paddingTop: '15px', objectFit: 'cover', background: 'linear-gradient(to bottom, transparent, rgba(0,242,254,0.1))' }}
            priority
          />
        </div>
      </section>

      <section className="featured-media" style={{ padding: '0 2rem 5rem 2rem', textAlign: 'center' }}>
        <h2 className="section-title">Featured Highlights</h2>
        <div className="media-grid">
          <div className="media-card">
            <iframe 
              width="100%" 
              height="400" 
              src="https://www.youtube.com/embed/hyVawV_2lkg" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              style={{ borderRadius: '15px' }}
            ></iframe>
          </div>
          <div className="media-card" style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Facebook embed block needs white background for text legibility, height matching YT */}
            <iframe 
              src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fp%2F1DGqGFGsi1%2F&show_text=true&width=500" 
              width="100%" 
              height="400" 
              style={{ border: 'none', overflow: 'hidden', borderRadius: '15px' }} 
              scrolling="no" 
              frameBorder="0" 
              allowFullScreen={true} 
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .hero {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          gap: 4rem;
        }
        .hero-content {
          flex: 1;
        }
        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }
        .hero-title span {
          background: var(--accent-grad);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-desc {
          font-size: 1.15rem;
          color: var(--text-secondary);
          margin-bottom: 2.5rem;
          max-width: 600px;
        }
        .hero-btns {
          display: flex;
          gap: 1.5rem;
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
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .social-icons {
          display: flex;
          gap: 2rem;
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

        .hero-image-container {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        /* Responsive Media Grid Setup */
        .media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .media-card {
          background: var(--glass-bg);
          padding: 1.5rem;
          border-radius: 20px;
          border: 1px solid var(--glass-border);
          transition: transform 0.3s ease;
        }

        .media-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent-color);
        }

        @media (max-width: 1024px) {
          .hero {
            flex-direction: column-reverse;
            text-align: center;
            padding: 4rem 2rem;
          }
          .hero-desc {
            margin: 0 auto 2.5rem;
          }
          .hero-btns {
            justify-content: center;
          }
          .social-icons {
            justify-content: center;
          }
          .hero-image {
            width: 250px;
            height: 250px;
          }
        }

        @media (max-width: 640px) {
          .hero-title {
            font-size: 2.2rem;
          }
          .hero-btns {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}}/>
    </>
  );
}
