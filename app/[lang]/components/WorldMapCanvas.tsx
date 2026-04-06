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
    mapImage.src = '/assets/world_map_dots.png';

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
    };

    window.addEventListener('resize', resize);
    resize();

    // Taiwan is around 84% x, 45% y in most standard maps
    const twPos = { x: 0.84, y: 0.45 };
    const hubs = [
      { x: 0.15, y: 0.35 }, // US East
      { x: 0.51, y: 0.28 }, // UK/Europe
      { x: 0.82, y: 0.75 }, // Australia
      { x: 0.92, y: 0.33 }, // Japan
    ];

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.004;

      // 1. Draw the High-Res Dotted Map Image
      if (mapImage.complete) {
        ctx.globalAlpha = 0.35;
        // Draw image aspect-ratio aware
        const imgAspect = mapImage.width / mapImage.height;
        const canvasAspect = width / height;
        let drawW, drawH, drawX, drawY;

        if (canvasAspect > imgAspect) {
          drawH = height;
          drawW = height * imgAspect;
          drawX = (width - drawW) / 2;
          drawY = 0;
        } else {
          drawW = width;
          drawH = width / imgAspect;
          drawX = 0;
          drawY = (height - drawH) / 2;
        }

        ctx.drawImage(mapImage, drawX, drawY, drawW, drawH);
        ctx.globalAlpha = 1.0;

        // Recalculate hub positions based on actual draw area
        const getActualPos = (nx: number, ny: number) => ({
          x: drawX + nx * drawW,
          y: drawY + ny * drawH
        });

        const tx = getActualPos(twPos.x, twPos.y).x;
        const ty = getActualPos(twPos.y, twPos.y).y; // Corrected to ty using getActualPos logic separately for clarity

        // Just use a simpler consistent mapping for now to ensure lines hit the dots
        const tx_fixed = drawX + twPos.x * drawW;
        const ty_fixed = drawY + twPos.y * drawH;

        // 2. Taiwan Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00f2fe';
        ctx.fillStyle = '#00f2fe';
        ctx.beginPath();
        ctx.arc(tx_fixed, ty_fixed, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 3. Draw Arcs
        ctx.setLineDash([30, 120]);
        ctx.lineDashOffset = -time * 600;
        
        hubs.forEach(h => {
          const hx = drawX + h.x * drawW;
          const hy = drawY + h.y * drawH;
          
          const grad = ctx.createLinearGradient(tx_fixed, ty_fixed, hx, hy);
          grad.addColorStop(0, 'rgba(0, 242, 254, 0.1)');
          grad.addColorStop(0.5, 'rgba(0, 242, 254, 0.7)');
          grad.addColorStop(1, 'rgba(0, 242, 254, 0.1)');
          
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 2;
          ctx.shadowColor = 'rgba(0, 242, 254, 0.5)';
          
          const cpX = (tx_fixed + hx) / 2;
          const cpY = Math.min(ty_fixed, hy) - (Math.abs(tx_fixed - hx) * 0.2); // Proportional arc height
          
          ctx.beginPath();
          ctx.moveTo(tx_fixed, ty_fixed);
          ctx.quadraticCurveTo(cpX, cpY, hx, hy);
          ctx.stroke();
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
        zIndex: -1,
        pointerEvents: 'none'
      }} 
    />
  );
};

export default WorldMapCanvas;
