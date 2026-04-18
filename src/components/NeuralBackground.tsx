import React, { useEffect, useRef } from 'react';
import { VisualConfig } from '../types';

interface NeuralBackgroundProps {
  config?: VisualConfig;
}

export default function NeuralBackground({ config }: NeuralBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let sparks: Spark[] = [];
    
    const particleCount = config?.particleCount || 60;
    const connectionDistance = 150;
    const mouse = { x: 0, y: 0, radius: 150 };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
      }

      update(width: number, height: number) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          
          // Add rhythmic pulse to interaction
          const pulse = Math.sin(Date.now() * 0.005) * 0.5 + 0.5;
          this.x -= Math.cos(angle) * force * (2 + pulse);
          this.y -= Math.sin(angle) * force * (2 + pulse);
        }

        // Add subtle flow field effect
        const time = Date.now() * 0.001;
        this.vx += Math.sin(this.y * 0.01 + time) * 0.01;
        this.vy += Math.cos(this.x * 0.01 + time) * 0.01;
        
        // Limit velocity
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const maxSpeed = 1.2;
        if (speed > maxSpeed) {
          this.vx = (this.vx / speed) * maxSpeed;
          this.vy = (this.vy / speed) * maxSpeed;
        }

        // Randomly emit sparks
        if (Math.random() < (config?.emissionRate || 0.01) * 0.05) {
          for (let i = 0; i < 3; i++) {
            sparks.push(new Spark(this.x, this.y));
          }
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Dynamic color based on position
        const hue = (this.x / window.innerWidth) * 30 - 15; // Subtle shift
        ctx.fillStyle = config?.particleColor || 'rgba(0, 242, 255, 0.5)';
        
        ctx.shadowBlur = (config?.glowIntensity || 10) * (Math.sin(Date.now() * 0.002) * 0.5 + 0.8);
        ctx.shadowColor = config?.particleColor || '#00f2ff';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    class Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = 1.0;
        this.color = config?.particleColor || '#00f2ff';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.02;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}${Math.floor(this.life * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      }
    }

    const init = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(width, height));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw ambient scan line
      const scanY = (Date.now() * 0.1) % canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(canvas.width, scanY);
      ctx.strokeStyle = `${config?.particleColor || '#00f2ff'}10`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = 1 - distance / connectionDistance;
            
            // Gradient for connection
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            gradient.addColorStop(0, `${config?.particleColor || '#00f2ff'}${Math.floor(opacity * 50).toString(16).padStart(2, '0')}`);
            gradient.addColorStop(1, `${config?.connectionColor || '#bc13fe'}${Math.floor(opacity * 50).toString(16).padStart(2, '0')}`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach(p => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx);
      });

      // Update and draw sparks
      sparks = sparks.filter(s => s.life > 0);
      sparks.forEach(s => {
        s.update();
        s.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1] opacity-60"
      style={{ filter: 'blur(0.5px)' }}
    />
  );
}
