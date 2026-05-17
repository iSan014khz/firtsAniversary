import { useEffect, useRef } from "react";

const CrayonUnderline = ({
  color = "#f4c738",
  duration = 800,
  delay = 0,
  thickness = 3,
  textClassName = "",
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const timer = setTimeout(() => {
      let start = null;

      // ── TEXTURA: genera varias "capas" de puntos con ruido distinto cada una
      const generateLayer = (wobble) => {
        const points = [];
        const steps = 60;
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          points.push({
            x: t * width,
            y: height * 0.6 + (Math.random() - 0.5) * wobble,
          });
        }
        return points;
      };

      // 4 capas superpuestas — como pasar el crayón varias veces
      const layers = [
        { points: generateLayer(2), alpha: 0.6, width: thickness * 0.6 },
        { points: generateLayer(3), alpha: 0.4, width: thickness * 0.9 },
        { points: generateLayer(2), alpha: 0.5, width: thickness * 1.0 },
        { points: generateLayer(4), alpha: 0.3, width: thickness * 0.5 },
      ];

      const drawLayer = (points, alpha, lineWidth, progress) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalAlpha = alpha;

        const visiblePoints = Math.floor(progress * points.length);
        if (visiblePoints < 2) return;

        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < visiblePoints; i++) {
          const mx = (points[i].x + points[i - 1].x) / 2;
          const my = (points[i].y + points[i - 1].y) / 2;
          ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, mx, my);
        }
        ctx.stroke();
      };

      // ── TEXTURA: puntos de "grano" estáticos generados una vez
      const grainPoints = Array.from({ length: 80 }, () => ({
        x: Math.random() * width,
        y: height * 0.3 + Math.random() * height * 0.6,
        r: Math.random() * 1.2,
        alpha: Math.random() * 0.25,
      }));

      const animate = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);

        ctx.clearRect(0, 0, width, height);

        // Dibuja las 4 capas
        layers.forEach(({ points, alpha, width: lw }) => {
          drawLayer(points, alpha, lw, progress);
        });

        // ── TEXTURA: grano encima proporcional al progreso
        const visibleGrain = Math.floor(progress * grainPoints.length);
        grainPoints.slice(0, visibleGrain).forEach(({ x, y, r, alpha }) => {
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.globalAlpha = alpha;
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        });

        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [color, duration, delay, thickness]);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        left: "-5px", // ← del original
        bottom: "-10px", // ← del original
        width: "100%", // ← cubre todo el texto + los -10px
        height: "32px", // ← del original
        pointerEvents: "none",
        imageRendering: "pixelated", // ← del original, da el grano
      }}
    />
  );
};

const UnderlinedText = ({ children, color, duration, delay, thickness, textClassName }) => (
  <span style={{ position: "relative", display: "inline-block" }} className={textClassName}>
    {children}
    <CrayonUnderline
      color={color}
      duration={duration}
      delay={delay}
      thickness={thickness}
    />
  </span>
);

export default UnderlinedText;
