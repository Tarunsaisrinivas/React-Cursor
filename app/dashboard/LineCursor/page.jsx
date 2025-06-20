"use client";

import React, { useEffect, useRef } from "react";

const LineTrailCursor = ({
  color = "#12E193",
  lineWidth = 3,
  maxTrailLength = 40,
  fadeDuration = 1000, // in ms
}) => {
  const canvasRef = useRef(null);
  const trail = useRef([]); // [{x, y, time}]

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

      // Remove old points
      trail.current = trail.current.filter(
        (point) => now - point.time < fadeDuration
      );

      if (trail.current.length > 1) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = lineWidth;

        for (let i = 1; i < trail.current.length; i++) {
          const p0 = trail.current[i - 1];
          const p1 = trail.current[i];

          // Opacity based on age of newer point
          const age = now - p1.time;
          const alpha = Math.max(1 - age / fadeDuration, 0);

          ctx.strokeStyle = `rgba(${hexToRgb(color)}, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
        }
      }

      requestAnimationFrame(draw);
    };

    const handleMouseMove = (e) => {
      trail.current.push({
        x: e.clientX,
        y: e.clientY,
        time: performance.now(),
      });

      if (trail.current.length > maxTrailLength) {
        trail.current.shift();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, [color, lineWidth, maxTrailLength, fadeDuration]);

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

export default LineTrailCursor;
