"use client";

import CodeSnippetViewer from "@/components/ui/code-snippet-viewer";
import BinaryCursor from "binary-cursor"; // Optional live demo of binary effect

export default function CodeExamples() {
  const binaryCursorCode = `"use client";

import React, { useState, useEffect, useRef } from "react";

const BinaryCursor = ({
  color = "#12E193",
  size = 13,
  count = 2,
  spread = 2,
  duration = 1100,
  frequency = 80,
  movementThreshold = 5,
}) => {
  const [particles, setParticles] = useState([]);
  const animationRef = useRef();
  const lastEmitTime = useRef(0);
  const cursorPos = useRef({ x: -1000, y: -1000 });
  const lastCursorPos = useRef({ x: -1000, y: -1000 });
  const isMoving = useRef(false);
  const moveTimeoutRef = useRef(null);
  const isCursorInWindow = useRef(false);

  useEffect(() => {
    const animate = (timestamp) => {
      if (
        isCursorInWindow.current &&
        isMoving.current &&
        cursorPos.current.y > 3 &&
        timestamp - lastEmitTime.current > frequency
      ) {
        lastEmitTime.current = timestamp;

        const newParticles = Array.from({ length: count }).map((_, i) => ({
          id: \`\${timestamp}_\${i}_\${Math.random().toString(36).slice(2, 9)}\`,
          char: Math.random() > 0.5 ? "1" : "0",
          x: cursorPos.current.x,
          y: cursorPos.current.y,
          angle: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 1.5,
          opacity: 1,
          createdAt: timestamp,
        }));

        setParticles((prev) => [...prev.slice(-100), ...newParticles]);
      }

      setParticles((prev) =>
        prev
          .map((p) => {
            const age = timestamp - p.createdAt;
            const progress = Math.min(age / duration, 1);
            return {
              ...p,
              x: p.x + Math.cos(p.angle) * p.speed * progress * spread,
              y: p.y + Math.sin(p.angle) * p.speed * progress * spread,
              opacity: 1 - progress,
              scale: 1 + progress * 0.5,
            };
          })
          .filter((p) => timestamp - p.createdAt < duration * 1.2)
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const dx = clientX - lastCursorPos.current.x;
      const dy = clientY - lastCursorPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      cursorPos.current = { x: clientX, y: clientY };
      lastCursorPos.current = { x: clientX, y: clientY };

      if (distance > movementThreshold) {
        if (!isMoving.current) isMoving.current = true;
        clearTimeout(moveTimeoutRef.current);
        moveTimeoutRef.current = setTimeout(() => {
          isMoving.current = false;
        }, 100);
      }
    };

    const handleMouseEnter = (e) => {
      isCursorInWindow.current = true;
      cursorPos.current = { x: e.clientX, y: e.clientY };
      lastCursorPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      isCursorInWindow.current = false;
      isMoving.current = false;
      cursorPos.current = { x: -1000, y: -1000 };
      lastCursorPos.current = { x: -1000, y: -1000 };
    };

    const handleBlur = () => handleMouseLeave();
    const handleFocus = () => (isCursorInWindow.current = true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    setTimeout(() => {
      const { innerWidth, innerHeight } = window;
      const x = window.event?.clientX || innerWidth / 2;
      const y = window.event?.clientY || innerHeight / 2;
      if (x >= 0 && x < innerWidth && y >= 0 && y < innerHeight) {
        isCursorInWindow.current = true;
        cursorPos.current = { x, y };
        lastCursorPos.current = { x, y };
      }
    }, 50);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      cancelAnimationFrame(animationRef.current);
      clearTimeout(moveTimeoutRef.current);
    };
  }, [count, spread, duration, frequency, movementThreshold]);

  const particleStyle = (p) => ({
    position: "fixed",
    left: \`\${p.x}px\`,
    top: \`\${p.y}px\`,
    color,
    fontSize: \`\${size}px\`,
    fontFamily: "monospace",
    fontWeight: "bold",
    pointerEvents: "none",
    zIndex: 9999,
    transform: \`translate(-50%, -50%) scale(\${p.scale})\`,
    opacity: p.opacity,
    textShadow: \`0 0 8px \${color}\`,
    willChange: "transform, opacity",
    userSelect: "none",
  });

  return (
    <>
      {particles.map((p) => (
        <div key={p.id} style={particleStyle(p)}>
          {p.char}
        </div>
      ))}
    </>
  );
};

export default BinaryCursor;
`;

  const binaryUsage = `import BinaryCursor from "./BinaryCursor";

export default function App() {
  return (
    <>
      <BinaryCursor />
      <div className="p-8">
        <h1 className="text-3xl font-bold">Move your mouse!</h1>
      </div>
    </>
  );
}`;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-16">
      <section>
        {/* Optional: Render the effect live */}
        <BinaryCursor />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Binary Cursor Component
        </h2>
        <CodeSnippetViewer
          code={binaryCursorCode}
          title="BinaryCursor.jsx"
          maxLines={25}
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use BinaryCursor
        </h2>
        <CodeSnippetViewer
          code={binaryUsage}
          title="UsageExample.jsx"
          maxLines={15}
        />
      </section>
    </main>
  );
}
