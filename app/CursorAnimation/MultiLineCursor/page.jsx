"use client";

import React, { useEffect, useRef } from "react";

const MultiLineTrailCursor = ({
  color = "#12E193",
  lineWidth = 3,
  maxTrailLength = 30,
  fadeDuration = 1000, // ms
  lineCount = 3,
  lineSpacing = 10, // px offset between lines
}) => {
  const canvasRef = useRef(null);

  // Each line has its own trail of points
  // trails: array of arrays [{x, y, time}]
  const trails = useRef(Array.from({ length: lineCount }, () => []));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = timestamp || performance.now();

      for (let t = 0; t < lineCount; t++) {
        // Remove old points for this trail
        trails.current[t] = trails.current[t].filter(
          (point) => now - point.time < fadeDuration
        );

        if (trails.current[t].length > 1) {
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = lineWidth;

          for (let i = 1; i < trails.current[t].length; i++) {
            const p0 = trails.current[t][i - 1];
            const p1 = trails.current[t][i];

            const age = now - p1.time;
            const alpha = Math.max(1 - age / fadeDuration, 0);

            ctx.strokeStyle = `rgba(${hexToRgb(color)}, ${alpha.toFixed(3)})`;

            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    };

    const handleMouseMove = (e) => {
      // For each line trail, offset its points horizontally by lineSpacing * (index - center)
      const center = (lineCount - 1) / 2;

      for (let t = 0; t < lineCount; t++) {
        const offsetX = (t - center) * lineSpacing;
        trails.current[t].push({
          x: e.clientX + offsetX,
          y: e.clientY,
          time: performance.now(),
        });

        if (trails.current[t].length > maxTrailLength) {
          trails.current[t].shift();
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, [color, lineWidth, maxTrailLength, fadeDuration, lineCount, lineSpacing]);

  function hexToRgb(hex) {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3)
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    const num = parseInt(hex, 16);
    return `${(num >> 16) & 255},${(num >> 8) & 255},${num & 255}`;
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
        width: "100vw",
        height: "100vh",
      }}
    />
  );
};

export default MultiLineTrailCursor;
