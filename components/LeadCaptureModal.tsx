'use client';

import React, { useState } from 'react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
  lang: 'zh' | 'en' | 'ja';
  projectName: string;
}

export default function LeadCaptureModal({ isOpen, onClose, onSuccess, lang, projectName }: LeadCaptureModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const t = {
    zh: {
      title: '解鎖完整內容 & 獲取分析報告',
      subtitle: `請留下資訊解鎖「${projectName}」，並免費閱覽【數據趨勢報告】與【實戰數據懶人包】。`,
      namePlaceholder: '您的稱呼 / 姓名',
      emailPlaceholder: '您的電子郵件地址',
      submit: '立即獲取 & 解鎖',
      loading: '發送中...',
      success: '驗證成功！正在為您開啟...',
      error: '發生錯誤，請稍後再試。',
      invalidEmail: '請輸入有效的電子郵件地址',
      privacy: '我們絕不會發送垃圾郵件，僅分享數據洞察。填寫即代表同意接收分析技術分享。'
    },
    en: {
      title: 'Get Insights & Unlock Full Access',
      subtitle: `Leave your details to unlock "${projectName}" and get my exclusive "Data Strategy Insider" reports for free.`,
      namePlaceholder: 'Your Name / Identity',
      emailPlaceholder: 'Your Email Address',
      submit: 'Get Access Now',
      loading: 'Sending...',
      success: 'Success! Opening for you...',
      error: 'Something went wrong. Please try again.',
      invalidEmail: 'Please enter a valid email address',
      privacy: 'No spam, ever. Receive data-related technical insights directly in your inbox.'
    },
    ja: {
      title: 'フルアクセス & 限定レポートを入手',
      subtitle: `「${projectName}」をアンロックし、無料の【データトレンド・インサイト】定期レポートを受け取ります。`,
      namePlaceholder: 'お名前 / 呼称',
      emailPlaceholder: 'メールアドレスを入力',
      submit: '今すぐ入手 & 解鎖',
      loading: '送信中...',
      success: '成功！読み込んでいます...',
      error: 'エラーが発生しました。もう一度お試しください。',
      invalidEmail: '有効なメールアドレスを入力してください',
      privacy: 'スパム送信はありません。分析技術情報の受け取りに同意したことになります。'
    }
  }[lang];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Robust email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setErrorMsg(t.invalidEmail);
      return;
    }

    if (!name.trim()) {
      setStatus('error');
      setErrorMsg(lang === 'zh' ? '請輸入姓名' : 'Please enter your name');
      return;
    }

    setStatus('loading');
    try {
      const resp = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, project: projectName, lang })
      });

      if (resp.ok) {
        setStatus('success');
        localStorage.setItem('user_email', email);
        localStorage.setItem('user_name', name);
        setTimeout(() => {
          onSuccess(email);
          onClose();
        }, 1500);
      } else {
        const errorData = await resp.json();
        throw new Error(errorData.error || 'Failed to submit');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || t.error);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)',
      padding: '20px'
    }} onClick={onClose}>
      
      <div 
        style={{
          background: 'rgba(20, 20, 20, 0.8)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          borderRadius: '30px',
          padding: '3rem 2rem',
          maxWidth: '480px',
          width: '100%',
          position: 'relative',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.5rem', right: '1.5rem',
            background: 'none', border: 'none', color: '#666',
            fontSize: '1.5rem', cursor: 'pointer'
          }}
        >✕</button>

        <div style={{
          width: '60px', height: '60px', borderRadius: '15px',
          background: 'var(--accent-grad)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem', fontSize: '1.5rem'
        }}>📧</div>

        <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '1rem', color: '#fff' }}>
          {t.title}
        </h2>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
          {t.subtitle}
        </p>

        <form onSubmit={handleSubmit}>
          <input 
            type="text"
            placeholder={t.namePlaceholder}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%', padding: '1rem 1.5rem', borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff', fontSize: '1rem', marginBottom: '1rem',
              outline: 'none', transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />

          <input 
            type="email"
            placeholder={t.emailPlaceholder}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%', padding: '1rem 1.5rem', borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff', fontSize: '1rem', marginBottom: '1.2rem',
              outline: 'none', transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />

          <button 
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="btn-primary"
            style={{ width: '100%', padding: '1rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold' }}
          >
            {status === 'loading' ? t.loading : (status === 'success' ? t.success : t.submit)}
          </button>
        </form>

        {status === 'error' && (
          <p style={{ color: '#ff4d4d', fontSize: '0.85rem', marginTop: '1rem' }}>{errorMsg}</p>
        )}

        <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: '#444', lineHeight: '1.4' }}>
          {t.privacy}
        </p>
      </div>
    </div>
  );
}
