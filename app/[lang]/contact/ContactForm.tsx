'use client';

import { useState } from 'react';

interface ContactFormProps {
  t: {
    name: string;
    email: string;
    msg: string;
    send: string;
  };
}

export default function ContactForm({ t }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzA1L7bmxwj1Grs9VRvT8kzfAUvzZceRfaku_7b8dsWhGVusv1k4-MwWrP42AnaapaaYg/exec"; 

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  return (
    <form className="contact-form" style={{ marginTop: '2rem' }} onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">{t.name}</label>
        <input type="text" id="name" name="name" required disabled={status === 'loading'} />
      </div>
      <div className="form-group">
        <label htmlFor="email">{t.email}</label>
        <input type="email" id="email" name="email" required disabled={status === 'loading'} />
      </div>
      <div className="form-group">
        <label htmlFor="message">{t.msg}</label>
        <textarea id="message" name="message" rows={5} required disabled={status === 'loading'}></textarea>
      </div>
      
      <button 
        type="submit" 
        className="btn-primary" 
        disabled={status === 'loading' || status === 'success'}
        style={{ 
          marginTop: '1.5rem', 
          width: '100%', 
          padding: '0.75rem', 
          opacity: status === 'loading' ? 0.7 : 1,
          textAlign: 'center',
          cursor: status === 'loading' ? 'wait' : 'pointer',
          background: status === 'success' ? '#10b981' : undefined,
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}
      >
        {status === 'loading' ? '⏳ 傳送中...' : status === 'success' ? '✅ 訊息已成功送出！' : t.send}
      </button>

      {status === 'error' && (
        <p style={{ color: '#ef4444', marginTop: '1rem', textAlign: 'center' }}>
          ❌ 抱歉，傳送失敗，請稍後再試。
        </p>
      )}
    </form>
  );
}
