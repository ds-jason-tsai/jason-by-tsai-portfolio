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

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportId, lang, price, productName }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Missing URL in response:', data);
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleCheckout} 
      disabled={loading}
      className={`btn-primary`}
      style={{
        opacity: loading ? 0.7 : 1,
        cursor: loading ? 'not-allowed' : 'pointer'
      }}
    >
      {loading ? 'Processing...' : buttonText}
    </button>
  );
}
