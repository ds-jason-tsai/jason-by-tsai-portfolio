import Image from "next/image";
import Link from "next/link";
import { getDictionary } from '../dictionaries';
import StatSection from './components/StatSection';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = {
    zh: "傑森數據 Jason Analytics | 數據分析、AI 與 MarTech 專家",
    en: "Jason Analytics | Data Analysis, AI & MarTech Expert",
    ja: "ジェイソン・アナリティクス | データ分析・AI・MarTech エキスパート"
  };
  const descriptions = {
    zh: "傑森數據 Jason Analytics 官方作品集。由數據專家 Jason Tsai (蔡傑森) 主理，深耕數據分析與 AI 轉型領域。精通 Python、SQL 與 Tableau 數據視覺化，專注於 AI 機器學習建模、MarTech 數位行銷科技導入與 FinTech 數據專案實務。提供專業商業分析、數據工程顧問服務，並協助企業透過數據驅動決策轉化為實質營收。立即探索數據驅動的無限可能。",
    en: "Official portfolio of Jason Analytics, led by data expert Jason Tsai. Providing comprehensive solutions in Data Analysis, AI/ML Modeling, MarTech, and Data Engineering to help businesses unlock value through data-driven insights.",
    ja: "データ専門家 Jason Tsai が主宰する Jason Analytics 公式ポートフォリオ。Python、SQL、Tableau を駆使し、データ分析、AI機械学習モデリング、MarTech 導入、FinTech プロジェクトを包括的に支援します。ビジネスインテリジェンスとデータエンジニアリングを通じて、企業の意思決定を最適化し、価値創出を加速させます。"
  };

  return {
    title: titles[lang as 'zh'|'en'|'ja'] || titles.zh,
    description: descriptions[lang as 'zh'|'en'|'ja'] || descriptions.zh,
    alternates: {
      canonical: `https://jason-by-tsai-portfolio.vercel.app/${lang}`,
      languages: {
        'zh': 'https://jason-by-tsai-portfolio.vercel.app/zh',
        'en': 'https://jason-by-tsai-portfolio.vercel.app/en',
        'ja': 'https://jason-by-tsai-portfolio.vercel.app/ja',
      },
    },
  };
}

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
            {dict.home.title.split('\n').map((line: string, i: number) => (
              <span key={i} style={{ display: 'block' }}>{line}</span>
            ))}
            <span className="hero-subtitle">
              {dict.home.subtitle.split('\n').map((line: string, i: number) => (
                <span key={i} style={{ display: 'block' }}>
                  {line}
                </span>
              ))}
            </span>
          </h1>
          <p className="hero-desc" style={{ whiteSpace: 'pre-wrap', lineHeight: '2' }}>
            {dict.home.description}
          </p>
          
          <div className="hero-btns" style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem', justifyContent: 'center' }}>
            <a href={`/${lang}/portfolio?utm_source=internal&utm_medium=button&utm_campaign=home_hero_portfolio`} className="btn-primary" style={{ minWidth: '180px', textAlign: 'center' }}>{dict.home.cta}</a>
            <a href={`/${lang}/contact?utm_source=internal&utm_medium=button&utm_campaign=home_hero_contact`} className="btn-primary btn-secondary" style={{ minWidth: '180px', textAlign: 'center' }}>
              {dict.home.contact_cta}
            </a>
          </div>
        </div>

        <div className="hero-image-outer">
          <div className="hero-image-container" style={{ flexDirection: 'column', alignItems: 'center' }}>
            <div className="image-wrapper-glow">
              <Link href={`/${lang}/experience?utm_source=internal&utm_medium=image&utm_campaign=home_profile_image`} style={{ display: 'block', borderRadius: '50%' }}>
                <Image 
                  src="/images/Jason6.jpg" 
                  alt="Jason Tsai" 
                  width={380} 
                  height={380} 
                  className="hero-image"
                  sizes="(max-width: 768px) 300px, 400px"
                  style={{ objectPosition: 'center top', objectFit: 'cover', borderRadius: '50%', border: '4px solid rgba(0, 242, 254, 0.3)', position: 'relative', zIndex: 1, transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', cursor: 'pointer' }}
                  priority
                />
              </Link>
            </div>
            <h2 className="jason-name" style={{ marginTop: '1.5rem', fontSize: '2.5rem', fontWeight: 800, background: 'var(--accent-grad)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '2px' }}>
              Jason Tsai
            </h2>
            <p style={{ textAlign: 'center', fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '1rem', fontWeight: 500, lineHeight: '1.6', maxWidth: '650px' }}>
               {lang === 'zh' ? '金融業資料分析師、多個數位學習平台 AI/資料分析導師、臺清交政等社團資料視覺化講師' : (lang === 'ja' ? '金融データアナリスト / AI・データ分析講師 / トップ大学データ視覚化講師' : 'Financial Data Analyst / AI & Data Analysis Instructor / Top Universities Data Viz Lecturer')}
            </p>

            <div className="hero-links-integration" style={{ marginTop: '2.5rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '2.5rem', alignItems: 'center' }}>
              
              <div className="paid-links-subsection">
                <p className="social-label" style={{ marginBottom: '1.2rem', color: '#00f2fe', fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {(dict.home as any).featured_courses || '專業數據洞察 (付費專區)'}
                </p>
                <div className="course-links" style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center' }}>
                  {(dict.home as any).featured_items?.map((item: any) => (
                    <a 
                      key={item.id}
                      href={`/${lang}/reports?utm_source=internal&utm_medium=button&utm_campaign=home_featured_reports&utm_content=${item.id}#${item.id}`} 
                      className="social-icon-link"
                      style={{ fontSize: '1rem', fontWeight: 600 }}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="social-links-subsection">
                <p className="social-label" style={{ marginBottom: '1.2rem', color: '#00f2fe', fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {dict.home.social_label || (lang === 'zh' ? '追蹤我的數據洞察' : 'Follow my Data Insights')}
                </p>
                <div className="social-icons" style={{ gap: '2.5rem', display: 'flex', justifyContent: 'center' }}>
                  <a href="https://tw.linkedin.com/in/jasonb0604?utm_source=jason-by-tsai-portfolio.vercel.app&utm_medium=referral&utm_campaign=home_social_linkedin" target="_blank" rel="noopener noreferrer" className="social-icon-link">LinkedIn</a>
                  <a href="https://www.instagram.com/chartbar0713/?utm_source=jason-by-tsai-portfolio.vercel.app&utm_medium=referral&utm_campaign=home_social_instagram" target="_blank" rel="noopener noreferrer" className="social-icon-link">Instagram</a>
                  <a href="https://medium.com/@jasonb0604?utm_source=jason-by-tsai-portfolio.vercel.app&utm_medium=referral&utm_campaign=home_social_medium" target="_blank" rel="noopener noreferrer" className="social-icon-link">Medium</a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <StatSection dict={dict} />

      <section className="featured-media" style={{ padding: '6rem 0', textAlign: 'center', width: '100%', overflow: 'hidden' }}>
        <h2 className="section-title">{dict.home.featured_highlights || (lang === 'zh' ? '精選特輯' : 'Featured Highlights')}</h2>
        <div className="carousel-container">
          <div className="carousel-track">
            {[...featuredPosts, ...featuredPosts].map((post, index) => (
              <div className="media-card" key={index}>
                <div className="media-card-header">
                  <span className="media-badge" style={{ color: 'var(--accent-color)', fontWeight: '900', border: '1px solid var(--accent-color)' }}>{post.label}</span>
                  <h3 className="media-title">{post.title}</h3>
                </div>
                <div className="media-iframe-wrapper" style={{ flex: 1, display: 'flex', alignItems: 'center', background: post.type === 'facebook' || post.type === 'instagram' ? '#fff' : 'transparent', borderRadius: '10px' }}>
                  <iframe 
                    src={`${post.src}${post.src.includes('?') ? '&' : '?'}utm_source=jason-by-tsai-portfolio.vercel.app&utm_medium=referral&utm_campaign=home_featured_media_iframe`} 
                    width="100%" 
                    height={post.type === 'youtube' ? '315' : '480'} 
                    style={{ border: 'none', overflow: 'hidden', borderRadius: '10px' }} 
                    scrolling="no" 
                    allowFullScreen={true} 
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    loading="lazy"
                    title={post.title}
                  ></iframe>
                </div>
                <div style={{ padding: '0 1.5rem 1.5rem' }}>
                  <a href={`${post.link}${post.link.includes('?') ? '&' : '?'}utm_source=jason-by-tsai-portfolio.vercel.app&utm_medium=referral&utm_campaign=home_featured_media`} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'block', fontSize: '0.9rem', padding: '0.8rem' }}>
                    {lang === 'zh' ? '前往原文觀看' : 'View Original Post'} ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .hero-image:hover {
          transform: scale(1.08) rotate(1deg);
          box-shadow: 0 0 40px rgba(0, 242, 254, 0.4);
          border-color: rgba(0, 242, 254, 0.8) !important;
        }
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
          max-width: 950px;
          width: 100%;
          z-index: 2;
        }
        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }
        .hero-subtitle {
          background: var(--accent-grad);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-desc {
          font-size: 1.15rem;
          color: var(--text-secondary);
          margin-bottom: 2.5rem;
          max-width: 950px;
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
        .hero-image-outer {
          position: relative;
          width: 100%;
          max-width: 1200px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2rem;
          overflow: visible;
          min-height: 520px;
        }
        @media (max-width: 768px) {
          .hero-image-outer { min-height: 350px; }
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
        
        .media-title {
          font-size: 1.2rem;
          min-height: 3rem; /* Force two lines worth of space to prevent layout shift */
          display: flex;
          align-items: center;
        }

        .mobile-only-br { display: none; }

        @media (max-width: 768px) {
          .hero-title { font-size: 1.8rem !important; line-height: 1.4; }
          .hero-desc { padding: 0; font-size: 1rem !important; }
          .hero-btns { flex-direction: column; align-items: center; gap: 1rem !important; }
          .btn-primary { width: 100%; max-width: 280px; }
          .mobile-only-br { display: block; }
          .media-card { width: calc(100vw - 40px); max-width: 400px; }
          .jason-name { font-size: 2rem !important; }
        }
        @media (max-width: 480px) {
          .hero-title { font-size: 1.6rem !important; }
          .jason-name { font-size: 1.8rem !important; }
        }
      `}}/>
    </>
  );
}
