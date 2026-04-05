'use client';

import { useState, useEffect, useRef } from 'react';

interface CounterProps {
  value: number;
  label: string;
  suffix?: string;
  duration?: number;
}

const Counter = ({ value, label, suffix = '', duration = 2000 }: CounterProps) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = countRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeOutExpo = (x: number): number => {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
      };
      
      const currentCount = Math.floor(easeOutExpo(progress) * value);
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, value, duration]);

  return (
    <div className="stat-card" ref={countRef}>
      <div className="stat-value">
        {count}{suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default function StatSection({ dict }: { dict: any }) {
  if (!dict?.home?.stats) return null;

  return (
    <section className="stats-section">
      <div className="stats-container">
        <Counter value={500} label={dict.home.stats.students} suffix="+" />
        <Counter value={50} label={dict.home.stats.projects} suffix="+" />
        <Counter value={100} label={dict.home.stats.hours} suffix="+" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .stats-section {
          padding: 4rem 2rem;
          width: 100%;
          position: relative;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.02);
          border-top: 1px solid var(--glass-border);
          border-bottom: 1px solid var(--glass-border);
        }
        .stats-container {
          max-width: 1000px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3rem;
          text-align: center;
        }
        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .stat-card:hover {
          transform: translateY(-10px);
        }
        .stat-value {
          font-size: 4rem;
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          background: var(--accent-grad);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1;
        }
        .stat-label {
          font-size: 1.1rem;
          color: var(--text-secondary);
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        @media (max-width: 768px) {
          .stats-container {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .stat-value {
            font-size: 3.5rem;
          }
          .stats-section {
            padding: 3rem 1.5rem;
          }
        }
      `}} />
    </section>
  );
}
