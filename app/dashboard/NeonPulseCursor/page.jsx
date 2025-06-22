import React from "react";
import NeonPulseCursor from "./component";
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

const page = () => {
    const NeonPulseCode = `"use client";
    
    import { useRef, useEffect, useState } from "react";
    
    export default function NeonPulseCursor({
      color = "#AD46FF", // Neon cyan
      radius = 12,
      pulseSpeed = 1000,
      blur = 20,
    }) {
      const Neon PulseRef = useRef(null);
      const [mousePos, setMousePos] = useState({ x: -9999, y: -9999 });
      const [isHovering, setIsHovering] = useState(false);
    
      useEffect(() => {
        const Neon Pulse = Neon PulseRef.current;
        if (!Neon Pulse) return;
    
        const ctx = Neon Pulse.getContext("2d");
        Neon Pulse.width = window.innerWidth;
        Neon Pulse.height = window.innerHeight;
    
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
          Neon Pulse.width = window.innerWidth;
          Neon Pulse.height = window.innerHeight;
        });
    
        return () => {
          window.removeEventListener("mousemove", updateMouse);
          window.removeEventListener("mouseleave", leaveMouse);
        };
      }, []);
    
      useEffect(() => {
        const Neon Pulse = Neon PulseRef.current;
        if (!Neon Pulse) return;
    
        const ctx = Neon Pulse.getContext("2d");
        let animationFrameId;
    
        const render = (timestamp) => {
          const t = timestamp % pulseSpeed;
          const pulse = 0.5 + 0.5 * Math.sin((2 * Math.PI * t) / pulseSpeed);
    
          ctx.clearRect(0, 0, Neon Pulse.width, Neon Pulse.height);
    
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
        <Neon Pulse
          ref={Neon PulseRef}
          className="fixed top-0 left-0 pointer-events-none z-50"
          style={{ width: "100vw", height: "100vh" }}
        />
      );
    }
    `;
    const NeonPulseUsage = `"use client";
    import NeonPulseCursor from "./NeonPulseCursor";
    export default function App() {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <NeonPulseCursor color="#AD46FF" radius={12} pulseSpeed={1000} blur={20} />
                <h1 className="text-3xl font-bold text-purple-500">
                    Move your mouse around!
                </h1>
            </div>
        );
    }
    `;
    const NeonPulseProps = `
    Prop	  |   Type	 | Default
    --------- |----------|----------		
    color	  |  string	 |"#AD46FF"	
    radius	  |  number	 |  12	
    pulseSpeed|  number	 | 1000	
    blur	  |  number	 |  20	
    `;
    return (
        <div className="min-h-screen w-full flex items-center justify-center mx-auto  dark:bg-[#171717] p-4">
            {/* Live Demo */}
            <NeonPulseCursor />

            <div className="w-full max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <MousePointer2 className="w-12 h-12 text-purple-500" />
                        <h1 className="text-3xl md:text-5xl font-bold text-purple-500 ">
                            Neon Pulse Effect
                        </h1>
                        <Badge variant="secondary" className="text-sm">
                            Interactive
                        </Badge>
                    </div>
                    <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                        Move your mouse around to see the Neon Pulse effect
                        in action!
                    </p>
                </div>

                <Tabs defaultValue="demo" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="demo">Live Demo</TabsTrigger>
                        <TabsTrigger value="component">Component</TabsTrigger>
                        <TabsTrigger value="usage">usage</TabsTrigger>
                        <TabsTrigger value="props">Props</TabsTrigger>
                    </TabsList>

                    <TabsContent value="demo" className="space-y-6">
                        <Card className="bg-white/50 dark:bg-[#171717]/50 backdrop-blur-sm border-2">
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl">
                                    Interactive Demo
                                </CardTitle>
                                <CardDescription className="text-lg">
                                    Move your cursor around this area to see the
                                    Neon Pulse
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
                                                Neon Pulse will follow your cursor
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
                                        NeonPulse
                                    </CardTitle>
                                    <CardDescription>
                                        Complete component implementation
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CodeSnippetViewer
                                    code={NeonPulseCode}
                                    title="NeonPulse.jsx"
                                    language="javascript"
                                    maxLines={25}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="usage" className="space-y-6">
                        {/* <Card>
                            <CardHeader>
                                <CardTitle>Usage</CardTitle>
                                <CardDescription>
                                    Install the required dependencies
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CodeSnippetViewer
                                    code={NeonPulseUsage}
                                    title="Usage in your app"
                                    language="bash"
                                    maxLines={5}
                                />
                            </CardContent>
                        </Card> */}

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Basic Usage</CardTitle>
                                    <CardDescription>
                                        How to implement the Neon Pulse in
                                        your app
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CodeSnippetViewer
                                    code={NeonPulseUsage}
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
                                    Customize the binary cursor effect with
                                    these props
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CodeSnippetViewer
                                    code={NeonPulseProps}
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
                                                The neon color of the pulse
                                                cursor. Accepts any valid CSS
                                                color value (e.g.,{" "}
                                                <code>"#AD46FF"</code>,{" "}
                                                <code>"cyan"</code>).
                                            </p>
                                        </div>

                                        <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                            <h4 className="font-semibold mb-2 text-purple-400">
                                                radius
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Radius (in pixels) of the
                                                animated cursor ring.
                                            </p>
                                        </div>

                                        <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                            <h4 className="font-semibold mb-2 text-purple-400">
                                                pulseSpeed
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Duration of the pulsing
                                                animation in milliseconds. Lower
                                                means faster pulses.
                                            </p>
                                        </div>

                                        <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                            <h4 className="font-semibold mb-2 text-purple-400">
                                                blur
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Blur intensity in pixels. Adds a
                                                glow effect around the pulse.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default page;
