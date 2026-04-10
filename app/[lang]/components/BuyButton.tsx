'use client';

import { useState } from 'react';

interface BuyButtonProps {
  reportId: string;
  lang: string;
  buttonText: string;
  price?: number;
  productName?: string;
}

export default function BuyButton({ reportId, lang, buttonText, price, productName }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, lang, price, productName }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      const gatewayUrl = data.paymentUrl || data.newebpayUrl;
      if (gatewayUrl && data.params) {
        // 動態建立隱藏 form，POST 到金流頁面
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = gatewayUrl;

        Object.entries(data.params as Record<string, string>).forEach(([key, val]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = val;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit(); // 跳轉到付款頁面
      } else {
        setError('無法建立付款連結，請稍後再試。');
      }
    } catch (err) {
      setError('網路錯誤，請稍後再試。');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="btn-primary"
        style={{
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'not-allowed' : 'pointer',
          border: 'none',
          padding: '0.8rem 1.8rem',
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '280px'
        }}
      >
        {loading ? '處理中…' : buttonText}
      </button>
      {error && (
        <p style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'center' }}>
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
