"use client";

import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MousePointer2 } from "lucide-react";
import CodeSnippetViewer from "@/components/ui/code-snippet-viewer";

// Binary Cursor Component
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
          id: `${timestamp}_${i}_${Math.random().toString(36).slice(2, 9)}`,
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
    left: `${p.x}px`,
    top: `${p.y}px`,
    color,
    fontSize: `${size}px`,
    fontFamily: "monospace",
    fontWeight: "bold",
    pointerEvents: "none",
    zIndex: 9999,
    transform: `translate(-50%, -50%) scale(${p.scale})`,
    opacity: p.opacity,
    textShadow: `0 0 8px ${color}`,
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

// Code snippets
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

export default BinaryCursor;`;

const usageCode = `import BinaryCursor from "./BinaryCursor";

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



const propsCode = `
color="rgba(0, 255, 255, 0.8)"
  size={18}
  count={4}
  spread={2.5}
  duration={2000}
  frequency={40}
  movementThreshold={10}
}`;

export default function Component() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center mx-auto  dark:bg-[#171717] p-4">
      {/* Live Demo */}
      <BinaryCursor color="#AD46FF" />

      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <MousePointer2 className="w-12 h-12 text-purple-500" />
            <h1 className="text-3xl md:text-5xl font-bold text-purple-500 ">
              Binary Cursor Effect
            </h1>
            <Badge variant="secondary" className="text-sm">
              Interactive
            </Badge>
          </div>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Move your mouse around to see the binary particle effect in action!
          </p>
        </div>

        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
            <TabsTrigger value="component">Component</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="props">Props</TabsTrigger>
          </TabsList>

          <TabsContent value="demo" className="space-y-6">
            <Card className="bg-white/50 dark:bg-[#171717]/50 backdrop-blur-sm border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Interactive Demo</CardTitle>
                <CardDescription className="text-lg">
                  Move your cursor around this area to see the binary effect
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[400px]  rounded-xl border-2 border-dashed border-purple-300/50 flex items-center justify-center relative overflow-hidden">
                  <div className="text-center space-y-6 z-10">
                    <div className="text-8xl">🖱️</div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-white">
                        Move your mouse here!
                      </p>
                      <p className="text-violet-300 text-lg">
                        Binary particles will follow your cursor
                      </p>
                    </div>
                  </div>
                  {/* Decorative grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="component" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">BinaryCursor.jsx</CardTitle>
                  <CardDescription>
                    Complete component implementation
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <CodeSnippetViewer
                  code={binaryCursorCode}
                  title="BinaryCursor.jsx"
                  language="javascript"
                  maxLines={25}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Basic Usage</CardTitle>
                  <CardDescription>
                    How to implement the binary cursor in your app
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <CodeSnippetViewer
                  code={usageCode}
                  title="App.jsx"
                  language="javascript"
                  maxLines={15}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="props" className=" space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Component Props</CardTitle>
                <CardDescription>
                  Customize the binary cursor effect with these props
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeSnippetViewer
                  code={propsCode}
                  title="Props variables"
                  language="typescript"
                  maxLines={10}
                />

                <div className="mt-6 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                      <h4 className="font-semibold mb-2 text-purple-400">
                        color
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        The color of the binary particles. Accepts any valid CSS
                        color value.
                      </p>
                    </div>

                    <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                      <h4 className="font-semibold mb-2 text-purple-400">
                        size
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Font size of the binary characters in pixels.
                      </p>
                    </div>
                    <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                      <h4 className="font-semibold mb-2 text-purple-400">
                        count
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Number of particles generated per emission.
                      </p>
                    </div>
                    <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                      <h4 className="font-semibold mb-2 text-purple-400">
                        spread
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        How far particles spread from the cursor position.
                      </p>
                    </div>
                    <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                      <h4 className="font-semibold mb-2 text-purple-400">
                        duration
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        How long particles remain visible in milliseconds.
                      </p>
                    </div>
                    <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                      <h4 className="font-semibold mb-2 text-purple-400">
                        frequency
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Time between particle emissions in milliseconds.
                      </p>
                    </div>
                  </div>
                  <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                    <h4 className="font-semibold mb-2 text-purple-400">
                      movementThreshold
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Minimum cursor movement distance to trigger particle
                      emission.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
