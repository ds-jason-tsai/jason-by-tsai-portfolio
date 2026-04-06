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

    const mapImage = new Image();
    mapImage.src = '/assets/world_map_outline.png';

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
    };

    window.addEventListener('resize', resize);
    resize();

    // Taiwan Precise Coordinates (Based on the generated map's proportion)
    const twPos = { x: 0.816, y: 0.465 }; 
    const hubs = [
      { x: 0.15, y: 0.35, label: 'US' }, 
      { x: 0.51, y: 0.28, label: 'Europe' }, 
      { x: 0.82, y: 0.75, label: 'Australia' }, 
      { x: 0.92, y: 0.33, label: 'Japan' }, 
    ];

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.004;

      if (mapImage.complete) {
        const imgAspect = mapImage.width / mapImage.height;
        const canvasAspect = width / height;
        let drawW, drawH, drawX, drawY;

        drawW = width;
        drawH = width / imgAspect;
        drawX = 0;
        drawY = (height - drawH) / 2;

        ctx.globalAlpha = 0.6;
        ctx.drawImage(mapImage, drawX, drawY, drawW, drawH);
        ctx.globalAlpha = 1.0;

        const tx = drawX + twPos.x * drawW;
        const ty = drawY + twPos.y * drawH;

        // Taiwan Pulse Glow
        const pulse = Math.sin(time * 5) * 5 + 15;
        ctx.shadowBlur = pulse;
        ctx.shadowColor = '#00f2fe';
        ctx.fillStyle = '#00f2fe';
        ctx.beginPath();
        ctx.arc(tx, ty, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Arcs
        ctx.setLineDash([40, 150]);
        ctx.lineDashOffset = -time * 800;
        
        hubs.forEach(h => {
          const hx = drawX + h.x * drawW;
          const hy = drawY + h.y * drawH;
          
          const grad = ctx.createLinearGradient(tx, ty, hx, hy);
          grad.addColorStop(0, 'rgba(0, 242, 254, 0.2)');
          grad.addColorStop(0.5, 'rgba(0, 242, 254, 0.9)');
          grad.addColorStop(1, 'rgba(0, 242, 254, 0.2)');
          
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.5;
          ctx.shadowBlur = 5;
          ctx.shadowColor = 'rgba(0, 242, 254, 0.6)';
          
          const cpX = (tx + hx) / 2;
          const cpY = Math.min(ty, hy) - (Math.abs(tx - hx) * 0.12);
          
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.quadraticCurveTo(cpX, cpY, hx, hy);
          ctx.stroke();
          ctx.shadowBlur = 0;
        });
      }

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
