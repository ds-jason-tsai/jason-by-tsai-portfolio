'use client';

import React, { useState } from 'react';

interface ShareButtonProps {
  lang: string;
  className?: string; // Optional for desktop/mobile styling
  isMobile?: boolean;
}

export default function ShareButton({ lang, className, isMobile }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const t = {
    zh: { share: '分享網站', copied: '網址已複製！' },
    en: { share: 'Share Site', copied: 'Link copied!' },
    ja: { share: 'サイトを共有', copied: 'リンクをコピーしました' }
  }[lang as 'zh' | 'en' | 'ja'] || { share: 'Share', copied: 'Copied!' };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    const shareData = {
      title: 'Jason Tsai | Data Analyst Portfolio',
      text: 'Check out this data analyst portfolio!',
      url: window.location.href.split('?')[0], // Share clean URL
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled or failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Clipboard failed:', err);
      }
    }
  };

  if (isMobile) {
    return (
      <a 
        href="#" 
        onClick={handleShare}
        style={{ 
          color: copied ? 'var(--accent-color)' : '#ffffff',
          fontSize: '1.2rem',
          fontWeight: '900',
          textDecoration: 'none',
          display: 'block',
          marginBottom: '1.2rem',
          letterSpacing: '1px',
          transition: 'all 0.3s'
        }}
      >
        🔗 {copied ? t.copied : t.share}
      </a>
    );
  }

  return (
    <button 
      onClick={handleShare}
      className={`share-btn ${className || ''}`}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: copied ? 'var(--accent-color)' : '#fff',
        transition: 'all 0.3s',
        position: 'relative'
      }}
      title={t.share}
    >
      <span style={{ fontSize: '1.2rem' }}>{copied ? '✓' : '🔗'}</span>
      {copied && (
        <span style={{
          position: 'absolute',
          bottom: '-30px',
          right: '0',
          background: 'var(--accent-grad)',
          color: '#000',
          fontSize: '0.7rem',
          padding: '2px 8px',
          borderRadius: '4px',
          whiteSpace: 'nowrap',
          fontWeight: 'bold'
        }}>
          {t.copied}
        </span>
      )}
    </button>
  );
}
