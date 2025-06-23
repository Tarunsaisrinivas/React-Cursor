"use client";

import CodeSnippetViewer from "@/components/ui/code-snippet-viewer";
import CanvasCursorComponent from "./component";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bug, Heart, MousePointer2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function CodeExamples() {
     const [selectedTab, setSelectedTab] = useState("demo");
        const pathname = usePathname();
        const encodedPath = encodeURIComponent(`[${pathname}]`);
        const issueUrl = `https://github.com/Tarunsaisrinivas/React-Cursor/issues/new?q=label%3A%22Bug%20%F0%9F%90%9B%22&title=[Bug 🪲]${encodedPath}: `;
        const featureUrl = `https://github.com/Tarunsaisrinivas/React-Cursor/issues/new?q=label%3A%22Feature%20%F0%9F%92%A1%22&title=[Feature 💡]${encodedPath}: `;
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
const canvasUsageCode = ` "use client";
import React from 'react';
import CanvasCursorComponent from './CanvasCursorComponent';
const App = () => {
  return (
    <div>
      <CanvasCursorComponent />
      {/* Your app content goes here */}
      <h1 className="text-center text-2xl mt-10">Welcome to My App</h1>
    </div>
  );
};
`
  return (
      <div className=" w-full flex items-center justify-center mx-auto  dark:bg-[#171717] p-4">
          {/* Live Demo */}
          <CanvasCursorComponent color="#AD46FF" />

          <div className="w-full max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 gap-6">
                  <div className="text-center lg:text-left space-y-4">
                      <div className="flex items-center justify-center lg:justify-start gap-3">
                          <MousePointer2 className="w-10 h-10 text-purple-500" />
                          <h1 className="text-3xl md:text-5xl font-bold text-purple-500">
                              Canvas Cursor Effect
                          </h1>
                          <Badge variant="secondary" className="text-sm">
                              Interactive
                          </Badge>
                      </div>
                      <p className="text-muted-foreground text-xl max-w-2xl">
                          Move your mouse around to see the Canvas cursor effect
                          in action!
                      </p>
                  </div>
                 
                  <div className="flex flex-col items-center lg:items-end gap-4">
                      <Button
                          variant="outline"
                          className={`backdrop-blur-md border border-purple-400/40 hover:bg-purple-500 hover:text-purple-400 shadow-lg flex items-center gap-2 ${
                              selectedTab === "contribute"
                                  ? "bg-white/30 backdrop-blur-3xl text-purple-500"
                                  : "text-purple-300"
                          }`}
                          onClick={() => setSelectedTab("contribute")}
                      >
                          <Heart className={`w-4 h-4 ${selectedTab === "contribute" ? "fill-purple-500" : ""}`} />
                          Contribute
                      </Button>
                      {/* <div className="text-center lg:text-right text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-400" />
                                    1.2k stars
                                </span>
                                <span className="flex items-center gap-1">
                                    <Github className="w-3 h-3 text-gray-400" />
                                    Open source
                                </span>
                            </div>
                        </div> */}
                  </div>
              </div>
              <Tabs
                  value={selectedTab}
                  onValueChange={setSelectedTab}
                  className="w-full"
              >
                  <TabsList className="grid w-full grid-cols-3 mb-8">
                      <TabsTrigger value="demo">Live Demo</TabsTrigger>
                      <TabsTrigger value="component">Component</TabsTrigger>
                      <TabsTrigger value="usage">usage</TabsTrigger>
                      {/* <TabsTrigger value="props">Props</TabsTrigger> */}
                  </TabsList>

                  <TabsContent value="demo" className="space-y-6">
                      <Card className="bg-white/50 dark:bg-[#171717]/50 backdrop-blur-sm border-2">
                          <CardHeader className="text-center">
                              <CardTitle className="text-2xl">
                                  Interactive Demo
                              </CardTitle>
                              <CardDescription className="text-lg">
                                  Move your cursor around this area to see the
                                  Canvas effect
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
                                              Canvas will follow your cursor
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
                                  <CardTitle className="text-xl">
                                      useCanvasCursor
                                  </CardTitle>
                                  <CardDescription>
                                      Complete component implementation
                                  </CardDescription>
                              </div>
                          </CardHeader>
                          <CardContent>
                              <CodeSnippetViewer
                                  code={canvasHook}
                                  title="useCanvasCursor.jsx"
                                  language="javascript"
                                  maxLines={25}
                              />
                          </CardContent>
                      </Card>
                  </TabsContent>

                  <TabsContent value="usage" className="space-y-6">
                      <Card>
                          <CardHeader>
                              <CardTitle>Usage</CardTitle>
                              {/* <CardDescription>
                    Install the required dependencies
                  </CardDescription> */}
                          </CardHeader>
                          <CardContent>
                              <CodeSnippetViewer
                                  code={canvasCode}
                                  title="Usage in your app"
                                  language="bash"
                                  maxLines={5}
                              />
                          </CardContent>
                      </Card>

                      <Card>
                          <CardHeader className="flex flex-row items-center justify-between">
                              <div>
                                  <CardTitle>Basic Usage</CardTitle>
                                  <CardDescription>
                                      How to implement the Canvas cursor in your
                                      app
                                  </CardDescription>
                              </div>
                          </CardHeader>
                          <CardContent>
                              <CodeSnippetViewer
                                  code={canvasUsageCode}
                                  title="App.jsx"
                                  language="javascript"
                                  maxLines={15}
                              />
                          </CardContent>
                      </Card>
                  </TabsContent>

                  {/* <TabsContent value="props" className=" space-y-6">
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
            </TabsContent> */}

                  <TabsContent value="contribute">
                      <Card>
                          <CardHeader>
                              <CardTitle className="text-center">
                                  Help improve this component!
                              </CardTitle>
                          </CardHeader>
                          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
                              <a
                                  href={issueUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                              >
                                  <Button
                                      variant="outline"
                                      className="flex items-center gap-2"
                                  >
                                      <Bug className="w-4 h-4" />
                                      Report an Issue
                                  </Button>
                              </a>
                              <span className="text-muted-foreground text-sm md:flex m:items-center items-center text-center">
                                  or
                              </span>
                              <a
                                  href={featureUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                              >
                                  <Button
                                      variant="outline"
                                      className="flex items-center gap-2"
                                  >
                                      <Star className="w-4 h-4" />
                                      Request a Feature
                                  </Button>
                              </a>
                          </CardContent>
                      </Card>
                  </TabsContent>
              </Tabs>
          </div>
      </div>
  );
  }
  
