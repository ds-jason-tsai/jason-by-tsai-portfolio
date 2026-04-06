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

    // Simulation of world map points (More dense clusters to look like continents)
    const points: { x: number, y: number, alpha: number }[] = [];
    const spawnWorldPoints = (w: number, h: number) => {
      points.length = 0;
      // Define continents (Normalized coordinates 0-1)
      const continents = [
        { x: 0.15, y: 0.35, w: 0.2, h: 0.3 }, // North America
        { x: 0.25, y: 0.65, w: 0.15, h: 0.25 }, // South America
        { x: 0.5, y: 0.3, w: 0.15, h: 0.2 }, // Europe
        { x: 0.52, y: 0.6, w: 0.12, h: 0.25 }, // Africa
        { x: 0.75, y: 0.4, w: 0.2, h: 0.3 }, // Asia
        { x: 0.82, y: 0.75, w: 0.1, h: 0.15 }, // Australia
        { x: 0.84, y: 0.45, w: 0.02, h: 0.03 } // Taiwan (Highlighted)
      ];

      continents.forEach(c => {
        const numDots = 150; 
        for (let i = 0; i < numDots; i++) {
          points.push({
            x: (c.x + Math.random() * c.w) * w,
            y: (c.y + Math.random() * c.h) * h,
            alpha: Math.random() * 0.4 + 0.2
          });
        }
      });
    };

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      spawnWorldPoints(width, height);
    };

    window.addEventListener('resize', resize);
    resize();

    // Taiwan Start (Static normalized)
    const getPos = (nx: number, ny: number) => ({ x: nx * width, y: ny * height });
    
    // Flight destinations
    const destinations = [
      { nx: 0.25, ny: 0.4, label: 'US' },
      { nx: 0.55, ny: 0.35, label: 'EU' },
      { nx: 0.85, ny: 0.75, label: 'AU' },
      { nx: 0.88, ny: 0.42, label: 'JP' }
    ];

    let offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Dotted World Map
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Taiwan Glow
      const tw = getPos(0.85, 0.46);
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00F2FE';
      ctx.fillStyle = '#00F2FE';
      ctx.beginPath();
      ctx.arc(tw.x, tw.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 3. Flight Arcs
      offset += 0.003;
      if (offset > 1) offset = 0;

      destinations.forEach((dest) => {
        const dPos = getPos(dest.nx, dest.ny);
        
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        
        const gradient = ctx.createLinearGradient(tw.x, tw.y, dPos.x, dPos.y);
        gradient.addColorStop(0, 'rgba(0, 242, 254, 0.1)');
        gradient.addColorStop(0.5, 'rgba(0, 242, 254, 0.6)');
        gradient.addColorStop(1, 'rgba(0, 242, 254, 0.1)');
        
        ctx.strokeStyle = gradient;
        ctx.setLineDash([30, 150]);
        ctx.lineDashOffset = -offset * 800;

        // Curve
        const cpX = (tw.x + dPos.x) / 2;
        const cpY = Math.min(tw.y, dPos.y) - 80;
        
        ctx.moveTo(tw.x, tw.y);
        ctx.quadraticCurveTo(cpX, cpY, dPos.x, dPos.y);
        ctx.stroke();

        // Destination pulse
        ctx.fillStyle = 'rgba(0, 242, 254, 0.4)';
        ctx.beginPath();
        ctx.arc(dPos.x, dPos.y, 2, 0, Math.PI * 2);
        ctx.fill();
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
        zIndex: 0,
        pointerEvents: 'none'
      }} 
    />
  );
};

export default WorldMapCanvas;
