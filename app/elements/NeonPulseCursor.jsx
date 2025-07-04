"use client";

import { useRef, useEffect, useState } from "react";

export default function NeonPulseCursor({
  color = "#AD46FF", // Neon cyan
  radius = 12,
  pulseSpeed = 1000,
  blur = 20,
}) {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -9999, y: -9999 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const updateMouse = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsHovering(true);
    };

    const leaveMouse = () => {
      setIsHovering(false);
      setMousePos({ x: -9999, y: -9999 }); // hide cursor when leaving window
    };

    window.addEventListener("mousemove", updateMouse);
    window.addEventListener("mouseleave", leaveMouse);
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    return () => {
      window.removeEventListener("mousemove", updateMouse);
      window.removeEventListener("mouseleave", leaveMouse);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const render = (timestamp) => {
      const t = timestamp % pulseSpeed;
      const pulse = 0.5 + 0.5 * Math.sin((2 * Math.PI * t) / pulseSpeed);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isHovering) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, radius + pulse * 4, 0, Math.PI * 2);
        ctx.shadowColor = color;
        ctx.shadowBlur = blur + pulse * 10;
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePos, isHovering, color, radius, pulseSpeed, blur]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none z-50"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
