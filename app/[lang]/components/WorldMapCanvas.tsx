'use client';

import React, { useEffect, useRef } from 'react';

const WorldMapCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    // Simulation of world map points (Simplified dots)
    const points: { x: number, y: number, alpha: number }[] = [];
    const spawnPoints = () => {
      points.length = 0;
      // Define world map dot clusters (Rough coordinates for continents)
      // Taiwan is roughly at 83%, 45% of the canvas height/width in standard projection
      for (let i = 0; i < 600; i++) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          alpha: Math.random() * 0.3 + 0.1
        });
      }
    };

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      spawnPoints();
    };

    window.addEventListener('resize', resize);
    resize();

    // Flight arcs from Taiwan
    const taiwan = { x: width * 0.82, y: height * 0.45 };
    const targets = [
      { x: width * 0.2, y: height * 0.3, label: 'US' },      // US
      { x: width * 0.5, y: height * 0.25, label: 'EU' },     // Europe
      { x: width * 0.85, y: height * 0.7, label: 'AU' },     // Australia
      { x: width * 0.15, y: height * 0.6, label: 'LATAM' },  // Latin America
      { x: width * 0.55, y: height * 0.65, label: 'AF' }     // Africa
    ];

    let offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw World Dots (The Map)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Matrix numeric background (Very subtle)
      ctx.font = '10px monospace';
      ctx.fillStyle = 'rgba(0, 242, 254, 0.05)';
      for (let i = 0; i < 15; i++) {
          const char = Math.random() > 0.5 ? '1' : '0';
          const x = (width / 15) * i;
          const y = (offset * 100 + i * 50) % height;
          ctx.fillText(char, x, y);
      }

      // 3. Draw Flight Arcs from Taiwan
      offset += 0.005;
      if (offset > 1) offset = 0;

      targets.forEach((target, i) => {
        // Line styling
        const gradient = ctx.createLinearGradient(taiwan.x, taiwan.y, target.x, target.y);
        gradient.addColorStop(0, 'rgba(0, 242, 254, 0)');
        gradient.addColorStop(0.5, 'rgba(0, 242, 254, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 242, 254, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([20, 100]);
        ctx.lineDashOffset = -offset * 300;

        // Quadratic curve for arc
        const cpX = (taiwan.x + target.x) / 2;
        const cpY = Math.min(taiwan.y, target.y) - 100; // Control point for curve

        ctx.beginPath();
        ctx.moveTo(taiwan.x, taiwan.y);
        ctx.quadraticCurveTo(cpX, cpY, target.x, target.y);
        ctx.stroke();

        // Target dot
        ctx.fillStyle = 'rgba(0, 242, 254, 0.8)';
        ctx.beginPath();
        ctx.arc(target.x, target.y, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 242, 254, 1)';
      });

      // Reset shadows
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.8
      }} 
    />
  );
};

export default WorldMapCanvas;
