import React, { useEffect, useRef } from "react";

interface FireworksProps {
  durationMs?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
  shape?: "circle" | "star" | "rect";
  rotation?: number;
  rotationSpeed?: number;
}

const Fireworks: React.FC<FireworksProps> = ({ durationMs = 5000 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const colors = [
      "#ffd700", // Gold
      "#ffae00", // Amber
      "#00e575", // Emerald
      "#0ea5e9", // Cyan
      "#f43f5e", // Rose
      "#a855f7", // Purple
      "#ffffff", // White shine
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const createFirework = (x: number, y: number) => {
      const count = 50 + Math.floor(Math.random() * 40);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 7;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shapes: ("circle" | "star" | "rect")[] = ["circle", "star", "rect"];

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          alpha: 1,
          color,
          size: 2 + Math.random() * 4,
          decay: 0.012 + Math.random() * 0.018,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
        });
      }
    };

    // Initial burst salvo
    const launchSalvo = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      createFirework(w * 0.2 + Math.random() * w * 0.6, h * 0.2 + Math.random() * h * 0.35);
    };

    // Launch immediately upon mounting
    launchSalvo();
    launchSalvo();

    const intervalId = setInterval(() => {
      launchSalvo();
    }, 450);

    // Stop creating new fireworks after duration, let existing ones fade
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
    }, durationMs);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles = particles.filter((p) => p.alpha > 0);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.09; // Gravity
        p.vx *= 0.98; // Friction
        p.alpha -= p.decay;
        if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
          p.rotation += p.rotationSpeed;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;

        ctx.translate(p.x, p.y);
        if (p.rotation !== undefined) {
          ctx.rotate((p.rotation * Math.PI) / 180);
        }

        if (p.shape === "star") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "rect") {
          ctx.fillRect(-p.size, -p.size / 2, p.size * 2, p.size);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [durationMs]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
};

export default Fireworks;
