import Image from "next/image";
import { getDictionary } from '../dictionaries';
import StatSection from './components/StatSection';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  const dict = await getDictionary(lang);

  const featuredPosts = [
    {
      type: 'youtube',
      label: 'YouTube 邀請專訪',
      title: '傑森數據：資料分析師的轉職之路',
      src: 'https://www.youtube.com/embed/Jci-U6_jRIw',
      link: 'https://www.youtube.com/watch?v=Jci-U6_jRIw'
    },
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
      label: 'Facebook 專家分享',
      title: '專題演講：台大行銷管理顧問社 (NTU SC)',
      src: 'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fntuscmarketingclub%2Fposts%2Fpfbid0zUWYsKdJKRZE1CdAKBGiEq5ciP5kAoiPNi8RqqUTkJkMrM3AyfNfSP4RKKSHoaVtl&show_text=true&width=500',
      link: 'https://www.facebook.com/ntuscmarketingclub/posts/pfbid0zUWYsKdJKRZE1CdAKBGiEq5ciP5kAoiPNi8RqqUTkJkMrM3AyfNfSP4RKKSHoaVtl'
    },
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            {dict.home.title} <br />
            <span>{dict.home.subtitle}</span>
          </h1>
          <p className="hero-desc" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
            {dict.home.description}
          </p>
          
          <div className="hero-btns">
            <a href={`/${lang}/portfolio`} className="btn-primary">{dict.home.cta}</a>
            <a href={`/${lang}/contact`} className="btn-primary btn-secondary">
              {dict.home.contact_cta}
            </a>
          </div>

          <div className="social-links-section">
            <p className="social-label" style={{ marginBottom: '1.2rem', color: '#00f2fe', fontSize: '1.4rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              {dict.home.social_label || (lang === 'zh' ? '追蹤我的數據洞察' : 'Follow my Data Insights')}
            </p>
            <div className="social-icons" style={{ gap: '2rem' }}>
              <a href="https://tw.linkedin.com/in/jasonb0604" target="_blank" rel="noopener noreferrer" className="social-icon-link">LinkedIn</a>
              <a href="https://www.instagram.com/chartbar0713/" target="_blank" rel="noopener noreferrer" className="social-icon-link">Instagram</a>
              <a href="https://medium.com/@jasonb0604" target="_blank" rel="noopener noreferrer" className="social-icon-link">Medium</a>
            </div>
          </div>

          <div className="hero-courses-section" style={{ marginTop: '5rem' }}>
             <p className="social-label" style={{ marginBottom: '2rem', color: '#00f2fe', fontSize: '1.4rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{dict.home.featured_courses || '推薦熱門課程'}</p>
             <div className="course-buttons" style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
               <a href="https://live.rookiesavior.net/course/tableau" target="_blank" rel="noopener noreferrer" className="btn-outline-cyan">
                 📊 {lang === 'zh' ? 'Tableau 商業視覺化實戰' : 'Tableau Business Viz'}
               </a>
               <a href="https://live.rookiesavior.net/course/AI-NotubookLM" target="_blank" rel="noopener noreferrer" className="btn-outline-cyan">
                 🤖 {lang === 'zh' ? 'NotebookLM x AI 應用' : 'NotebookLM x AI Apps'}
               </a>
             </div>
          </div>
        </div>

        <div className="hero-image-outer">
          <div className="hero-image-container" style={{ flexDirection: 'column', alignItems: 'center' }}>
            <div className="image-wrapper-glow">
              <Image 
                src="/images/Jason6.jpg" 
                alt="Jason Tsai" 
                width={380} 
                height={380} 
                className="hero-image"
                style={{ objectPosition: 'center top', objectFit: 'cover', borderRadius: '50%', border: '4px solid rgba(0, 242, 254, 0.3)', position: 'relative', zIndex: 1 }}
                priority
              />
            </div>
            <h2 style={{ marginTop: '1.5rem', fontSize: '2.5rem', fontWeight: 800, background: 'var(--accent-grad)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '2px' }}>
              Jason Tsai
            </h2>
            <p style={{ textAlign: 'center', fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '1rem', fontWeight: 500, lineHeight: '1.6', maxWidth: '650px' }}>
               {lang === 'zh' ? '金融業資料分析師、多個數位學習平台 AI/資料分析導師、臺清交政等社團資料視覺化講師' : (lang === 'ja' ? '金融データアナリスト / AI・データ分析講師 / トップ大学データ視覚化講師' : 'Financial Data Analyst / AI & Data Analysis Instructor / Top Universities Data Viz Lecturer')}
            </p>
          </div>
        </div>
      </section>

      <StatSection dict={dict} />

      <section className="featured-media" style={{ padding: '6rem 0', textAlign: 'center', width: '100%', overflow: 'hidden' }}>
        <h2 className="section-title">{dict.home.featured_highlights || (lang === 'zh' ? '精選特輯' : 'Featured Highlights')}</h2>
        <div className="carousel-container">
          <div className="carousel-track">
            {/* Map the array twice for seamless infinite scrolling */}
            {[...featuredPosts, ...featuredPosts].map((post, index) => (
              <div className="media-card" key={index}>
                <div className="media-card-header">
                  <span className="media-badge">{post.label}</span>
                  <h3 className="media-title">{post.title}</h3>
                </div>
                <div className="media-iframe-wrapper" style={{ flex: 1, display: 'flex', alignItems: 'center', background: post.type === 'facebook' || post.type === 'instagram' ? '#fff' : 'transparent', borderRadius: '10px' }}>
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
                  {lang === 'zh' ? '前往原文觀看' : 'View Original Post'} ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .social-icon-link {
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.3s ease;
          display: inline-block;
        }
        .social-icon-link:hover {
          transform: translateY(-5px) scale(1.1);
          color: var(--accent-color) !important;
          text-shadow: 0 0 15px rgba(0, 242, 254, 0.5);
        }
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
          z-index: 2;
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
          max-width: 800px;
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
        }

        .btn-outline-cyan {
          padding: 0.8rem 1.8rem;
          font-size: 0.95rem;
          font-weight: 700;
          color: #00f2fe;
          background: transparent;
          border: 1px solid #00f2fe;
          border-radius: 40px;
          text-decoration: none;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .btn-outline-cyan:hover {
          background: rgba(0, 242, 254, 0.1);
          box-shadow: 0 0 15px rgba(0, 242, 254, 0.3);
          transform: translateY(-2px);
        }
        
        .hero-image-outer {
          position: relative;
          width: 100%;
          max-width: 1200px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2rem;
          overflow: visible;
        }

        .hero-image-container {
          display: flex;
          justify-content: center;
          position: relative;
          z-index: 10;
        }

        .image-wrapper-glow {
          position: relative;
          padding: 10px;
          border-radius: 50%;
        }

        .image-wrapper-glow::after {
          content: '';
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: var(--accent-grad);
          opacity: 0.15;
          filter: blur(20px);
          z-index: -1;
        }

        .carousel-container {
          width: 100%;
          overflow: hidden;
          position: relative;
          padding: 2rem 0;
        }

        .carousel-track {
          display: flex;
          width: max-content;
          gap: 2.5rem;
          animation: scroll 80s linear infinite;
        }

        .media-card {
          width: 500px;
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

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 1.25rem)); }
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem; }
          .media-card { width: 320px; }
        }
      `}}/>
    </>
  );
}
