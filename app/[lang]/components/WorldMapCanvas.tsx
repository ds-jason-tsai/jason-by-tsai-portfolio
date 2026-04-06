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
    let width = 0;
    let height = 0;

    // Simulation of world map points (Accurate continent shapes)
    const points: { x: number, y: number, alpha: number }[] = [];
    
    // Continent rough shapes (Normalized 0-1)
    const continents = [
      // North America
      { x: 0.1, y: 0.2, w: 0.25, h: 0.3 },
      // South America 
      { x: 0.25, y: 0.55, w: 0.15, h: 0.35 },
      // Greenland
      { x: 0.35, y: 0.1, w: 0.08, h: 0.1 },
      // Europe
      { x: 0.45, y: 0.2, w: 0.15, h: 0.2 },
      // Africa
      { x: 0.45, y: 0.45, w: 0.18, h: 0.4 },
      // Asia
      { x: 0.6, y: 0.15, w: 0.3, h: 0.45 },
      // Australia
      { x: 0.75, y: 0.7, w: 0.15, h: 0.2 },
    ];

    const generateMap = (w: number, h: number) => {
      points.length = 0;
      continents.forEach(c => {
        const dots = Math.floor(w * h * 0.001 * (c.w * c.h) * 100); 
        for (let i = 0; i < dots; i++) {
          const px = (c.x + Math.random() * c.w) * w;
          const py = (c.y + Math.random() * c.h) * h;
          points.push({ x: px, y: py, alpha: Math.random() * 0.4 + 0.1 });
        }
      });
      // Add Taiwan specifically
      for(let i=0; i<15; i++) {
        points.push({ x: 0.84 * w + Math.random()*5, y: 0.45 * h + Math.random()*5, alpha: 0.8 });
      }
    };

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
      generateMap(width, height);
    };

    window.addEventListener('resize', resize);
    resize();

    const twPos = { x: 0.84, y: 0.45 };
    const hubs = [
      { x: 0.2, y: 0.35 }, // US
      { x: 0.52, y: 0.3 }, // London
      { x: 0.82, y: 0.75 }, // Sydney
      { x: 0.92, y: 0.35 }, // Tokyo
    ];

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.005;

      // 1. Draw Dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Taiwan Glow
      const tx = twPos.x * width;
      const ty = twPos.y * height;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00f2fe';
      ctx.fillStyle = '#00f2fe';
      ctx.beginPath();
      ctx.arc(tx, ty, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 3. Draw Arcs
      ctx.setLineDash([20, 100]);
      ctx.lineDashOffset = -time * 500;
      hubs.forEach(h => {
        const hx = h.x * width;
        const hy = h.y * height;
        
        const grad = ctx.createLinearGradient(tx, ty, hx, hy);
        grad.addColorStop(0, 'rgba(0, 242, 254, 0.2)');
        grad.addColorStop(0.5, 'rgba(0, 242, 254, 0.6)');
        grad.addColorStop(1, 'rgba(0, 242, 254, 0.2)');
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        
        const cpX = (tx + hx) / 2;
        const cpY = Math.min(ty, hy) - 100;
        
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.quadraticCurveTo(cpX, cpY, hx, hy);
        ctx.stroke();
      });

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
        zIndex: -1,
        pointerEvents: 'none'
      }} 
    />
  );
};

export default WorldMapCanvas;
