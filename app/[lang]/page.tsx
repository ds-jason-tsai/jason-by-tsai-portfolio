import Image from "next/image";
import { getDictionary } from '../dictionaries';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  const dict = await getDictionary(lang);

  const featuredPosts = [
    {
      type: 'youtube',
      label: 'YouTube 企業研討會',
      title: '零壹科技：敏捷自助BI分析',
      src: 'https://www.youtube.com/embed/hyVawV_2lkg',
      link: 'https://www.youtube.com/watch?v=hyVawV_2lkg'
    },
    {
      type: 'facebook',
      label: 'Facebook 粉絲專頁',
      title: '演講精華：台大資料分析社',
      src: 'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FNTUDAC%2Fposts%2Fpfbid024zWGDXEdUVaLHU24TymiTaFHfLQKPx2sMvFk9jxzSVKKaxeUnPDQuFmE2JBjAsTql&show_text=true&width=500',
      link: 'https://www.facebook.com/NTUDAC/posts/pfbid024zWGDXEdUVaLHU24TymiTaFHfLQKPx2sMvFk9jxzSVKKaxeUnPDQuFmE2JBjAsTql'
    },
    {
      type: 'facebook',
      label: 'Facebook 粉絲專頁',
      title: '專案實務：政大資料分析社',
      src: 'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fnccuda%2Fposts%2Fpfbid02kL85mfA8yUgVVpoBMrgfQ1QZRzYMyxikdYNrVcEXiArBspxyTskaUduAdN3Uxpsal&show_text=true&width=500',
      link: 'https://www.facebook.com/nccuda/posts/pfbid02kL85mfA8yUgVVpoBMrgfQ1QZRzYMyxikdYNrVcEXiArBspxyTskaUduAdN3Uxpsal'
    },
    {
      type: 'instagram',
      label: 'Instagram 社課分享',
      title: 'Tableau視覺化：清大資料科學社',
      src: 'https://www.instagram.com/p/DOSypNMEicE/embed',
      link: 'https://www.instagram.com/p/DOSypNMEicE/'
    },
    {
      type: 'facebook',
      label: 'Facebook 粉絲專頁',
      title: '職涯分享：台大 SC 創新創業',
      src: 'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fntuscmarketingclub%2Fposts%2Fpfbid0zUWYsKdJKRZE1CdAKBGiEq5ciP5kAoiPNi8RqqUTkJkMrM3AyfNfSP4RKKSHoaVtl&show_text=true&width=500',
      link: 'https://www.facebook.com/ntuscmarketingclub/posts/pfbid0zUWYsKdJKRZE1CdAKBGiEq5ciP5kAoiPNi8RqqUTkJkMrM3AyfNfSP4RKKSHoaVtl'
    },
    {
      type: 'instagram',
      label: 'Instagram 工作坊',
      title: 'Tableau特訓：清大管顧社',
      src: 'https://www.instagram.com/p/CtjZ0K7rEqT/embed',
      link: 'https://www.instagram.com/p/CtjZ0K7rEqT/'
    }
  ];

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

          <div className="hero-courses-section" style={{ marginTop: '3rem' }}>
             <p className="social-label">{dict.home.featured_courses || '推薦熱門課程'}</p>
             <div className="course-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
               <a href="https://live.rookiesavior.net/course/tableau" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.5rem', fontSize: '0.95rem', borderRadius: '15px' }}>
                 <span style={{ fontSize: '1.2rem' }}>📊</span> Tableau 商業視覺化實戰
               </a>
               <a href="https://live.rookiesavior.net/course/AI-NotubookLM" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.5rem', fontSize: '0.95rem', borderRadius: '15px' }}>
                 <span style={{ fontSize: '1.2rem' }}>🤖</span> NotebookLM x AI 應用
               </a>
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
            style={{ objectPosition: 'center top', objectFit: 'cover' }}
            priority
          />
        </div>
      </section>

      <section className="featured-media" style={{ padding: '2rem 0 5rem 0', textAlign: 'center', width: '100%', overflow: 'hidden' }}>
        <h2 className="section-title">{lang === 'zh' ? '精選特輯' : 'Featured Highlights'}</h2>
        <div className="carousel-container">
          <div className="carousel-track">
            {/* Map the array twice for seamless infinite scrolling */}
            {[...featuredPosts, ...featuredPosts].map((post, index) => (
              <div className="media-card" key={index}>
                <div className="media-card-header">
                  <span className="media-badge">{post.label}</span>
                  <h3 className="media-title">{post.title}</h3>
                </div>
                <div className="media-iframe-wrapper" style={{ background: post.type === 'facebook' || post.type === 'instagram' ? '#fff' : 'transparent' }}>
                  <iframe 
                    src={post.src} 
                    width="100%" 
                    height={post.type === 'youtube' ? '315' : '480'} 
                    style={{ border: 'none', overflow: 'hidden', borderRadius: '10px' }} 
                    scrolling="no" 
                    frameBorder="0" 
                    allowFullScreen={true} 
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  ></iframe>
                </div>
                <a href={post.link} target="_blank" rel="noopener noreferrer" className="media-action">
                  前往原文觀看 ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .hero {
          min-height: auto;
          padding: 4rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3rem;
          text-align: center;
        }
        .hero-content {
          max-width: 800px;
          width: 100%;
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
          margin-left: auto;
          margin-right: auto;
        }
        .hero-btns {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 3rem;
          justify-content: center;
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
          justify-content: center;
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
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }

        /* Infinite Carousel Setup */
        .carousel-container {
          width: 100%;
          overflow: hidden;
          position: relative;
          padding: 1rem 0;
        }
        
        .carousel-track {
          display: flex;
          width: max-content;
          gap: 2.5rem;
          padding: 0 1.25rem;
          animation: scroll 40s linear infinite;
        }

        .carousel-track:hover {
          animation-play-state: paused;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 1.25rem));
          }
        }
        
        .media-card {
          width: 380px;
          flex-shrink: 0;
          background: var(--glass-bg);
          padding: 1.5rem;
          border-radius: 20px;
          border: 1px solid var(--glass-border);
          transition: transform 0.3s ease, border-color 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .media-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent-color);
          box-shadow: 0 5px 15px rgba(0, 242, 254, 0.2);
        }
        
        .media-card-header {
          text-align: left;
        }
        
        .media-badge {
          display: inline-block;
          font-size: 0.75rem;
          color: #000;
          background: var(--accent-grad);
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }
        
        .media-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0;
        }
        
        .media-iframe-wrapper {
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-grow: 1;
        }

        .media-action {
          display: block;
          width: 100%;
          text-align: center;
          padding: 0.8rem 0;
          margin-top: 0.5rem;
          border-radius: 10px;
          background: rgba(0, 242, 254, 0.1);
          color: var(--accent-color);
          text-decoration: none;
          font-weight: 600;
          border: 1px solid rgba(0, 242, 254, 0.2);
          transition: all 0.3s ease;
        }

        .media-action:hover {
          background: var(--accent-grad);
          color: #000;
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

        @media (max-width: 768px) {
          .media-card {
            width: 320px;
            padding: 1rem;
          }
          .carousel-track {
            animation-duration: 25s; /* slightly faster on mobile */
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
