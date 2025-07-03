"use client";
import React, { useState } from "react";
import SmoothFollowCursor from "./component";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bug, MousePointer2, Star } from "lucide-react";
import CodeSnippetViewer from "@/components/ui/code-snippet-viewer";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";
const page = () => {
    const [selectedTab, setSelectedTab] = useState("demo");
    const pathname = usePathname();
    const encodedPath = encodeURIComponent(`${pathname}`);
    const issueUrl = `https://github.com/Tarunsaisrinivas/React-Cursor/issues/new?template=bug_report.md&title=[Bug 🪲]: ${encodedPath}&labels=bug:`;
    const featureUrl = `https://github.com/Tarunsaisrinivas/React-Cursor/issues/new?template=feature_request.md&title=[Feature💡]:${encodedPath}: `;

    const SmoothCursorCode = `"use client";
    
    import { useState, useEffect, useRef, useCallback } from "react";
    
    export default function SmoothFollowCursor({
        dotColor = "violet", 
        borderColor = "rgba(156, 39, 176, 0.5)", 
        dotSize = 8, 
        borderSize = 28, 
        hoverBorderSize = 44, 
        dotSpeed = 0.3, 
        borderSpeed = 0.1, 
        opacity = 0.9, 
        borderOpacity = 0.7, 
        dotOpacity = 1, 
        borderWidth = 3, 
    
        
    }) {
        const mousePosition = useRef({ x: 0, y: 0 });
        const dotPosition = useRef({ x: 0, y: 0 });
        const borderDotPosition = useRef({ x: 0, y: 0 });
        const [renderPos, setRenderPos] = useState({
            dot: { x: 0, y: 0 },
            border: { x: 0, y: 0 },
        });
        const [isHovering, setIsHovering] = useState(false);
        const [isMounted, setIsMounted] = useState(false);
        const animationFrameId = useRef(null);
        const interactiveElements = useRef([]);
        const rafActive = useRef(false);
    
        const lerp = useCallback((start, end, factor) => {
            return start + (end - start) * factor;
        }, []);
    
        const animate = useCallback(() => {
            if (!rafActive.current) return;
    
          
            dotPosition.current.x = lerp(
                dotPosition.current.x,
                mousePosition.current.x,
                dotSpeed
            );
            dotPosition.current.y = lerp(
                dotPosition.current.y,
                mousePosition.current.y,
                dotSpeed
            );
    
           
            borderDotPosition.current.x = lerp(
                borderDotPosition.current.x,
                dotPosition.current.x,
                borderSpeed
            );
            borderDotPosition.current.y = lerp(
                borderDotPosition.current.y,
                dotPosition.current.y,
                borderSpeed
            );
    
            setRenderPos({
                dot: {
                    x: dotPosition.current.x,
                    y: dotPosition.current.y,
                },
                border: {
                    x: borderDotPosition.current.x,
                    y: borderDotPosition.current.y,
                },
            });
    
            animationFrameId.current = requestAnimationFrame(animate);
        }, [dotSpeed, borderSpeed, lerp]);
    
        useEffect(() => {
            setIsMounted(true);
    
            const initPositions = () => {
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                mousePosition.current = { x: centerX, y: centerY };
                dotPosition.current = { x: centerX, y: centerY };
                borderDotPosition.current = { x: centerX, y: centerY };
                setRenderPos({
                    dot: { x: centerX, y: centerY },
                    border: { x: centerX, y: centerY },
                });
            };
    
            initPositions();
    
            const handleMouseMove = (e) => {
                mousePosition.current = { x: e.clientX, y: e.clientY };
                if (!rafActive.current) {
                    rafActive.current = true;
                    animate();
                }
            };
    
            const handleMouseEnter = () => setIsHovering(true);
            const handleMouseLeave = () => setIsHovering(false);
    
            window.addEventListener("mousemove", handleMouseMove);
    
            const getInteractiveElements = () => {
                return document.querySelectorAll(
                    "a, button, img, input, textarea, select, [data-cursor-hover]"
                );
            };
    
            interactiveElements.current = getInteractiveElements();
    
            interactiveElements.current.forEach((element) => {
                element.addEventListener("mouseenter", handleMouseEnter);
                element.addEventListener("mouseleave", handleMouseLeave);
            });
    
            rafActive.current = true;
            animationFrameId.current = requestAnimationFrame(animate);
    
            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
                interactiveElements.current.forEach((element) => {
                    element.removeEventListener("mouseenter", handleMouseEnter);
                    element.removeEventListener("mouseleave", handleMouseLeave);
                });
                rafActive.current = false;
                cancelAnimationFrame(animationFrameId.current);
            };
        }, [animate]);
    
        if (!isMounted) {
            return null;
        }
    
        return (
            <div className="pointer-events-none fixed inset-0 z-[9999]">
                <div
                    className="absolute rounded-full"
                    style={{
                            width: \`\${dotSize}px\`,
                            height: \`\${dotSize}px\`,
                        backgroundColor: dotColor,
                        transform: "translate(-50%, -50%)",
                        left: \`\${renderPos.dot.x}px\`,
                        top: \`\${renderPos.dot.y}px\`,
                        willChange: "transform",
                        transition: "transform 0.1s linear",
                        opacity: dotOpacity,
                    }}
                />
    
                <div
                    className="absolute rounded-full"
                    style={{
                        width: isHovering
                            ? \`\${hoverBorderSize}px\`
                            : \`\${borderSize}px\`,
                        height: isHovering
                            ? \`\${hoverBorderSize}px\`
                            : \`\${borderSize}px\`,
                        border: \`\${borderWidth}px solid \${borderColor}\`,
                        transform: "translate(-50%, -50%)",
                        left: \`\${renderPos.border.x}px\`,
                        top: \`\${renderPos.border.y}px\`,
                        willChange: "width, height, transform",
                        transition:
                            "width 0.3s ease, height 0.3s ease, transform 0.2s ease-out",
                        opacity: borderOpacity,
                    }}
                />
            </div>
        );
    }
    
    `;
    const SmoothCursorUsage = `"use client";
    import SmoothFollowCursor from "./SmoothFollowCursor";
    export default function App() {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
               <SmoothFollowCursor
              dotColor="violet" 
              borderColor="rgba(156, 39, 176, 0.5)" 
              dotSize={10} 
              borderSize={30}
              hoverBorderSize={50} 
              dotSpeed={0.4} 
              borderSpeed={0.15}
              dotOpacity={1} 
              borderOpacity={0.8}
              borderWidth={3} 
          />
            </div>
        );
    }
    `;
    const SmoothCursorProps = `
| Prop Name       | Type   | Default Value | 
| ----------------| -------| ------------  |
| color           | string | "#00ffcc"     | 
| dotColor        | string | "#ffffff"     | 
| borderColor     | string | "#ffffff"     |                                                
| dotSize         | number | 8             |                                             
| borderSize      | number | 28            |                        
| hoverBorderSize | number | 44            |
| dotSpeed        | number | 0.3           |
| borderSpeed     | number | 0.1           |
| opacity         | number | 0.9           |                          
| borderOpacity   | number | 0.7           |                                           
| dotOpacity      | number | 1             |                                              
| borderWidth     | number | 1             |`;
    return (
        <div className="w-full flex flex-col items-center justify-center dark:bg-[#171717] p-4">
            <SmoothFollowCursor />

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 gap-6 w-full">
                <div className="text-center lg:text-left space-y-4">
                    <div className="flex items-center justify-center lg:justify-start gap-3">
                        <MousePointer2 className="w-10 h-10 text-purple-500" />
                        <h1 className="text-3xl md:text-5xl font-bold text-purple-500">
                            Smooth Follow Cursor
                        </h1>
                        <Badge variant="secondary" className="text-sm">
                            Interactive
                        </Badge>
                    </div>
                    <p className="text-muted-foreground text-xl max-w-2xl mx-auto lg:mx-0">
                        Move your mouse around to see the smooth follow effect
                        in action!
                    </p>
                </div>
                <div className="flex flex-col items-center lg:items-end gap-4">
                    <Button
                        variant="outline"
                        className={`backdrop-blur-md border ${
                            selectedTab === "contribute"
                                ? "border-purple-400 text-purple-400"
                                : "border-purple-400/40 text-purple-300"
                        } hover:bg-purple-500 hover:text-purple-100 shadow-lg flex items-center gap-2`}
                        onClick={() => setSelectedTab("contribute")}
                    >
                        <Heart
                            className={`w-4 h-4 ${
                                selectedTab === "contribute"
                                    ? "fill-purple-400"
                                    : ""
                            }`}
                        />
                        Contribute
                    </Button>
                </div>
            </div>
            <Tabs
                value={selectedTab}
                onValueChange={setSelectedTab}
                className="w-full"
            >
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
                                Smooth Follow Cursor{" "}
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
                                            Smooth Follow Cursor will follow
                                            your cursor
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
                                    Smooth Follow Cursor
                                </CardTitle>
                                <CardDescription>
                                    Complete component implementation
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CodeSnippetViewer
                                code={SmoothCursorCode}
                                title="SmoothFollowCursor.jsx"
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
                                    How to implement the Smooth Follow Cursor in
                                    your app
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CodeSnippetViewer
                                code={SmoothCursorUsage}
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
                                Customize the binary cursor effect with these
                                props
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CodeSnippetViewer
                                code={SmoothCursorProps}
                                title="Props variables"
                                language="typescript"
                                maxLines={10}
                            />
                            <div className="mt-6 space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    {/* dotColor */}
                                    <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                        <h4 className="font-semibold mb-2 text-purple-400">
                                            dotColor
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Color of the small inner dot.
                                            Accepts any valid CSS color string.
                                        </p>
                                    </div>

                                    {/* borderColor */}
                                    <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                        <h4 className="font-semibold mb-2 text-purple-400">
                                            borderColor
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Border color of the outer circle.
                                        </p>
                                    </div>

                                    {/* dotSize */}
                                    <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                        <h4 className="font-semibold mb-2 text-purple-400">
                                            dotSize
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Size in pixels of the inner dot.
                                        </p>
                                    </div>

                                    {/* borderSize */}
                                    <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                        <h4 className="font-semibold mb-2 text-purple-400">
                                            borderSize
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Default size of the outer border
                                            circle (in px).
                                        </p>
                                    </div>

                                    {/* hoverBorderSize */}
                                    <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                        <h4 className="font-semibold mb-2 text-purple-400">
                                            hoverBorderSize
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Size of the outer circle when
                                            hovering over interactive elements.
                                        </p>
                                    </div>

                                    {/* dotSpeed */}
                                    <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                        <h4 className="font-semibold mb-2 text-purple-400">
                                            dotSpeed
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Interpolation speed of the inner dot
                                            (0–1). Higher means faster.
                                        </p>
                                    </div>

                                    {/* borderSpeed */}
                                    <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                        <h4 className="font-semibold mb-2 text-purple-400">
                                            borderSpeed
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Speed of the outer circle catching
                                            up to the dot (0–1).
                                        </p>
                                    </div>

                                    {/* borderOpacity */}
                                    <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                        <h4 className="font-semibold mb-2 text-purple-400">
                                            borderOpacity
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Opacity level of the outer border
                                            (0–1).
                                        </p>
                                    </div>

                                    {/* dotOpacity */}
                                    <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                        <h4 className="font-semibold mb-2 text-purple-400">
                                            dotOpacity
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Opacity level of the inner dot
                                            (0–1).
                                        </p>
                                    </div>

                                    {/* borderWidth */}
                                    <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                        <h4 className="font-semibold mb-2 text-purple-400">
                                            borderWidth
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Thickness of the outer circle’s
                                            border (in px).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

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
    );
};

export default page;
