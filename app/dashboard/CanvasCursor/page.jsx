// components/CodeExamples.jsx
"use client";

import CodeSnippetViewer from "@/components/ui/code-snippet-viewer";
import CanvasCursorComponent from "./component";

export default function CodeExamples() {
  const canvasCode = `import React from 'react';
import useCanvasCursor from '@/hooks/useCanvasCursor';

export default function CanvasCursorComponent() {
  useCanvasCursor();

  return (
    <canvas
      id="canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        width: '100vw',
        height: '100vh',
      }}
    />
  );
}
`;

  const canvasHook = `import { useEffect, useRef } from "react";

const useCanvasCursor = () => {
  const ctxRef = useRef(null);
  const fRef = useRef(null);
  const linesRef = useRef([]);
  const posRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const animationFrameId = useRef(null);

  const E = {
    friction: 0.5,
    trails: 20,
    size: 50,
    dampening: 0.25,
    tension: 0.98,
  };

  function PhaseWave({ phase = 0, offset = 0, frequency = 0.001, amplitude = 1 }) {
    let _phase = phase;
    return {
      update() {
        _phase += frequency;
        return offset + Math.sin(_phase) * amplitude;
      },
    };
  }

  class Node {
    constructor(x, y) {
      this.x = x || 0;
      this.y = y || 0;
      this.vx = 0;
      this.vy = 0;
    }
  }

  class Line {
    constructor(spring) {
      this.spring = spring + 0.1 * Math.random() - 0.02;
      this.friction = E.friction + 0.01 * Math.random() - 0.002;
      this.nodes = [];
      for (let i = 0; i < E.size; i++) {
        this.nodes.push(new Node(posRef.current.x, posRef.current.y));
      }
    }

    update() {
      let spring = this.spring;
      let t = this.nodes[0];
      t.vx += (posRef.current.x - t.x) * spring;
      t.vy += (posRef.current.y - t.y) * spring;

      for (let i = 0; i < this.nodes.length; i++) {
        t = this.nodes[i];
        if (i > 0) {
          const prev = this.nodes[i - 1];
          t.vx += (prev.x - t.x) * spring;
          t.vy += (prev.y - t.y) * spring;
          t.vx += prev.vx * E.dampening;
          t.vy += prev.vy * E.dampening;
        }
        t.vx *= this.friction;
        t.vy *= this.friction;
        t.x += t.vx;
        t.y += t.vy;
        spring *= E.tension;
      }
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.moveTo(this.nodes[0].x, this.nodes[0].y);

      for (let i = 1; i < this.nodes.length - 2; i++) {
        const c = this.nodes[i];
        const d = this.nodes[i + 1];
        const xc = (c.x + d.x) / 2;
        const yc = (c.y + d.y) / 2;
        ctx.quadraticCurveTo(c.x, c.y, xc, yc);
      }
      // curve through the last two points
      const secondLast = this.nodes[this.nodes.length - 2];
      const last = this.nodes[this.nodes.length - 1];
      ctx.quadraticCurveTo(secondLast.x, secondLast.y, last.x, last.y);
      ctx.stroke();
      ctx.closePath();
    }
  }

  const onMouseMove = (e) => {
    posRef.current.x = e.touches ? e.touches[0].pageX : e.clientX;
    posRef.current.y = e.touches ? e.touches[0].pageY : e.clientY;
    e.preventDefault();
  };

  const resizeCanvas = () => {
    if (!ctxRef.current) return;
    const canvas = ctxRef.current.canvas;
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight;
  };

  const render = () => {
    if (!ctxRef.current) return;
    const ctx = ctxRef.current;

    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = \`hsla(\${Math.round(fRef.current.update())}, 50%, 50%, 0.2)\`;
    ctx.lineWidth = 1;

    for (let i = 0; i < E.trails; i++) {
      const line = linesRef.current[i];
      line.update();
      line.draw(ctx);
    }
    ctx.frame++;
    animationFrameId.current = window.requestAnimationFrame(render);
  };

  useEffect(() => {
    const canvas = document.getElementById("canvas");
    if (!canvas) return;

    ctxRef.current = canvas.getContext("2d");
    ctxRef.current.running = true;
    ctxRef.current.frame = 1;

    fRef.current = PhaseWave({
      phase: Math.random() * 2 * Math.PI,
      amplitude: 85,
      frequency: 0.0015,
      offset: 285,
    });

    linesRef.current = [];
    for (let i = 0; i < E.trails; i++) {
      linesRef.current.push(new Line(0.4 + (i / E.trails) * 0.025));
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchstart", onMouseMove);
    window.addEventListener("touchmove", onMouseMove);
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("orientationchange", resizeCanvas);

    resizeCanvas();
    animationFrameId.current = window.requestAnimationFrame(render);

    return () => {
      ctxRef.current.running = false;
      window.cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onMouseMove);
      window.removeEventListener("touchmove", onMouseMove);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("orientationchange", resizeCanvas);
    };
  }, []);
};

export default useCanvasCursor;
`;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-16">
      <section>
        <CanvasCursorComponent />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Canvas Cursor Component
        </h2>
        <CodeSnippetViewer
          code={canvasCode}
          title="CanvasCursorComponent.jsx"
          maxLines={25}
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Canvas Cursor Hook
        </h2>
        <CodeSnippetViewer
          code={canvasHook}
          title="useCanvasCursor.js"
          maxLines={25}
        />
      </section>
    </main>
  );
}
