"use client";
import React, { useState, useRef } from "react";
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
import IOSCursor from "../../elements/IOSCursor";
const page = () => {
    const [selectedTab, setSelectedTab] = useState("demo");
    const demoContainerRef = useRef(null);
    const pathname = usePathname();
    const encodedPath = encodeURIComponent(`[${pathname}]`);
    const issueUrl = `https://github.com/Tarunsaisrinivas/React-Cursor/issues/new?template=bug_report.md&title=[Bug 🪲]: ${encodedPath}:`;
    const featureUrl = `https://github.com/Tarunsaisrinivas/React-Cursor/issues/new?template=feature_request.md&title=[Feature💡]:${encodedPath}: `;

    const IOSCode = String.raw`"use client";
    import { useEffect, useRef, useState } from "react";
    
    export default function IOSCursor({
        dotColor = "#fff",
        backgroundColor = "#007AFF",
        textColor = "white", 
        dotSize = 12,
        borderRadius = 12,
        dotSpeed = 0.15,
        backgroundColorSpeed = 0.3,
        dotOpacity = 1,
        backgroundColorOpacity = 1,
    }) {
        const cursorRef = useRef(null);
        const requestRef = useRef();
        const previousTimeRef = useRef();
        const [isMounted, setIsMounted] = useState(false);
        const [isTouchDevice, setIsTouchDevice] = useState(true);
    
        useEffect(() => {
            const checkTouchDevice = () => {
                const touchDevice =
                    "ontouchstart" in window ||
                    navigator.maxTouchPoints > 0 ||
                    navigator.msMaxTouchPoints > 0;
                setIsTouchDevice(touchDevice);
            };
    
            checkTouchDevice();
            setIsMounted(true);
    
            if (isTouchDevice) return;
    
            const cursor = cursorRef.current;
            if (!cursor) return;
    
            let mouseX = 0;
            let mouseY = 0;
            let cursorX = 0;
            let cursorY = 0;
            let isHoveringButton = false;
            let buttonRect = null;
    
            const handleMouseMove = (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            };
    
            let currentHoverTarget = null;
    
            const animate = (time) => {
                if (previousTimeRef.current !== undefined) {
                    if (isHoveringButton && buttonRect) {
                        cursorX = buttonRect.left + buttonRect.width / 2;
                        cursorY = buttonRect.top + buttonRect.height / 2;
    
                        cursor.style.transform = \`translate3d(\${buttonRect.left}px, \${buttonRect.top}px, 0) scale(1.1)\`;
                        cursor.style.width = \`\${buttonRect.width}px\`;
                        cursor.style.height = \`\${buttonRect.height}px\`;
                        cursor.style.borderRadius = \`\${borderRadius}px\`;
                        cursor.style.backgroundColor = backgroundColor;
                        cursor.style.opacity = backgroundColorOpacity.toString();
                        cursor.style.zIndex = "-0.80";
                        cursor.style.mixBlendMode = "screen";
                    } else {
                        cursorX += (mouseX - cursorX) * dotSpeed;
                        cursorY += (mouseY - cursorY) * dotSpeed;
    
                        cursor.style.transform = \`translate3d(\${cursorX - dotSize / 2}px, \${cursorY - dotSize / 2}px, 0)\`;
                        cursor.style.width = \`\${dotSize}px\`;
                        cursor.style.height = \`\${dotSize}px\`;
                        cursor.style.borderRadius = \`50%\`;
                        cursor.style.backgroundColor = dotColor;
                        cursor.style.opacity = dotOpacity.toString();
                        cursor.style.zIndex = "0";
                    }
                }
    
                previousTimeRef.current = time;
                requestRef.current = requestAnimationFrame(animate);
            };
    
    
            const handleMouseOver = (e) => {
                const target = e.target.closest("[data-cursor-hover], button, a");
                if (target) {
                    isHoveringButton = true;
                    currentHoverTarget = target;
                    buttonRect = target.getBoundingClientRect();
                    target.dataset.originalColor =
                        target.style.color || window.getComputedStyle(target).color;
                    target.dataset.originalZIndex =
                        target.style.zIndex ||
                        window.getComputedStyle(target).zIndex ||
                        "auto";
    
                    target.style.color = textColor;
                    target.style.position = "relative";
                    target.style.zIndex = "1"; 
                    target.style.mixBlendMode = "normal";
    
                    target.classList.add("cursor-hovering");
                }
            };
    
            const handleMouseOut = (e) => {
                const target = e.target.closest("[data-cursor-hover], button, a");
                if (target) {
                    isHoveringButton = false;
                    currentHoverTarget = null;
                    buttonRect = null;
    
                    target.style.color = textColor;
                    target.style.zIndex = target.dataset.originalZIndex || "0";
                    target.style.mixBlendMode = "normal";
    
                    target.classList.remove("cursor-hovering");
    
                    delete target.dataset.originalColor;
                    delete target.dataset.originalZIndex;
                }
            };
    
            const handleMouseMoveCheck = (e) => {
                const target = document.getElementById("appearance-button");
                if (target && isHoveringButton) {
                    const rect = target.getBoundingClientRect();
                    const isOutsideButton =
                        e.clientX < rect.left ||
                        e.clientX > rect.right ||
                        e.clientY < rect.top ||
                        e.clientY > rect.bottom;
    
                    if (isOutsideButton) {
                        isHoveringButton = false;
                        buttonRect = null;
                        target.style.color = textColor;
                        target.style.zIndex = "0";
                        target.style.mixBlendMode = "normal";
                    }
                }
            };
    
            document.body.style.cursor = "none";
    
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mousemove", handleMouseMoveCheck);
            document.addEventListener("mouseover", handleMouseOver);
            document.addEventListener("mouseout", handleMouseOut);
    
            requestRef.current = requestAnimationFrame(animate);
    
            return () => {
                document.body.style.cursor = "default";
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mousemove", handleMouseMoveCheck);
                document.removeEventListener("mouseover", handleMouseOver);
                document.removeEventListener("mouseout", handleMouseOut);
                if (requestRef.current) cancelAnimationFrame(requestRef.current);
            };
        }, [
            dotColor,
            backgroundColor,
            dotSize,
            borderRadius,
            dotSpeed,
            backgroundColorSpeed,
            dotOpacity,
            backgroundColorOpacity,
            isTouchDevice,
        ]);
    
        if (!isMounted || isTouchDevice) return null;
    
        return (
            <div
                ref={cursorRef}
                className="ios-cursor"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: \`\${dotSize}px\`,
                    height: \`\${dotSize}px\`,
                    backgroundColor: dotColor,
                    borderRadius: \`50%\`,
                    pointerEvents: "none",
                    zIndex: -9, 
                    opacity: 1,
                    transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    willChange: "transform, width, height, border-radius, opacity",
                }}
            />
        );
    }
    
    `;
    const IOSCursorUsage = `"use client";
import IOSCursor from "./IOSCursor";

export default function Home() {
    return (
        <main className="min-h-screen bg-white px-8 flex flex-col items-center justify-center font-[SF Pro Display] cursor-none">
          
            <div className="flex items-center gap-3 mb-12 p-4">
                <div className="w-2 h-2 bg-[#007AFF] rounded-full"></div>
                
            </div>

            <div className="flex flex-col items-center gap-8">
                <button
                    id="appearance-button"
                    className="px-8 py-4 bg-transparent text-[#1d1d1f] border-none rounded-xl text-[16px] font-semibold cursor-none min-w-[200px] relative z-[9999] transition-colors duration-200 hover:text-[#007AFF]"
                >
                    Appearance
                </button>

                <div className="text-center max-w-[400px]">
                    <p className="text-[#86868b] text-sm leading-relaxed mb-2">
                        Hover over the "Appearance" button - cursor stops and
                        becomes the background
                    </p>
                    <p className="text-[#86868b] text-sm leading-relaxed">
                        Move outside the button area to see cursor move again
                    </p>
                </div>
            </div>

            <IOSCursor />
        </main>
    );
}
    `;
    const IOSCursorProps = `
| Prop Name               | Type        | Default Value      |
|--------------------------|-------------|-----------------  |
| **dotColor**             | \`string\`    | \`"#fff"\`    | 
| **backgroundColor**      | \`string\`    | \`"#007AFF"\` |
| **textColor**            | \`string\`    | \`"white"\`     |
| **dotSize**              | \`number\`    | \`12\`          |
| **borderRadius**         | \`number\`    | \`12\`          |
| **dotSpeed**             | \`number\`    | \`0.15\`        |
| **backgroundColorSpeed** | \`number\`    | \`0.3\`         |
| **dotOpacity**           | \`number\`    | \`1\`           |
| **backgroundColorOpacity** | \`number\`  | \`1\`           |
`;

    return (
        <>
            <div className="w-full flex flex-col items-center justify-center dark:bg-[#171717] p-4 relative">
                {" "}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 gap-6 w-full">
                    <div className="text-center lg:text-left space-y-4">
                        <div className="flex items-center justify-center lg:justify-start gap-3">
                            <MousePointer2 className="w-10 h-10 text-purple-500" />
                            <h1 className="text-3xl md:text-5xl font-bold text-purple-500">
                                IOS Pointer Cursor
                            </h1>
                            <Badge variant="secondary" className="text-sm">
                                Interactive
                            </Badge>
                        </div>
                        <p className="text-muted-foreground text-xl max-w-2xl mx-auto lg:mx-0">
                            Move your mouse around to see the IOS Pointer Cursor
                            effect in action!
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
                                    IOS Pointer Cursor
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="demo-container min-h-[400px] rounded-xl border-2 border-dashed border-purple-300/50 flex items-center justify-center relative overflow-hidden bg-[#1d1d1f]">
                                    <main className="min-h-full w-full flex flex-col items-center justify-center p-8 font-sans relative">
                                        <div className="flex flex-col items-center gap-8">
                                            <button
                                                id="appearance-button"
                                                className="px-8 py-4 bg-transparent text-white border-none rounded-xl text-[16px] font-semibold cursor-none min-w-[200px] relative transition-colors duration-200"
                                            >
                                                React Cursor
                                            </button>

                                            <div className="text-center max-w-[400px] z-30">
                                                <p className="text-[#86868b] text-sm leading-relaxed mb-2">
                                                    Hover over the "React
                                                    Cursor" button - cursor
                                                    stops and becomes the
                                                    background
                                                </p>
                                                <p className="text-[#86868b] text-sm leading-relaxed">
                                                    Move outside the button area
                                                    to see cursor move again
                                                </p>
                                            </div>
                                        </div>
                                    </main>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <IOSCursor />
                    <TabsContent value="component" className="space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl">
                                        IOSCursor
                                    </CardTitle>
                                    <CardDescription>
                                        Complete component implementation
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CodeSnippetViewer
                                    code={IOSCode}
                                    title="IOSCursor.jsx"
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
                                        How to implement the IOS Pointer Cursor
                                        in your app
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CodeSnippetViewer
                                    code={IOSCursorUsage}
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
                                    Customize the IOS cursor effect with these
                                    props
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CodeSnippetViewer
                                    code={IOSCursorProps}
                                    title="IOSCursor Props"
                                    language="javascript"
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
                                                <strong>Type:</strong>{" "}
                                                <code>string</code>
                                                <br />
                                                <strong>Default:</strong>{" "}
                                                <code>"#fff"</code>
                                                <br />
                                                The color of the small dot
                                                cursor when not hovering over
                                                any element.
                                            </p>
                                        </div>

                                        {/* backgroundColor */}
                                        <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                            <h4 className="font-semibold mb-2 text-purple-400">
                                                backgroundColor
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Type:</strong>{" "}
                                                <code>string</code>
                                                <br />
                                                <strong>Default:</strong>{" "}
                                                <code>"#007AFF"</code>
                                                <br />
                                                The background color when
                                                hovering over buttons or links
                                                (iOS blue style).
                                            </p>
                                        </div>

                                        {/* textColor */}
                                        <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                            <h4 className="font-semibold mb-2 text-purple-400">
                                                textColor
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Type:</strong>{" "}
                                                <code>string</code>
                                                <br />
                                                <strong>Default:</strong>{" "}
                                                <code>"white"</code>
                                                <br />
                                                The text color of the hovered
                                                element when the cursor expands
                                                behind it.
                                            </p>
                                        </div>

                                        {/* dotSize */}
                                        <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                            <h4 className="font-semibold mb-2 text-purple-400">
                                                dotSize
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Type:</strong>{" "}
                                                <code>number</code>
                                                <br />
                                                <strong>Default:</strong>{" "}
                                                <code>12</code>
                                                <br />
                                                The diameter (in pixels) of the
                                                cursor dot when idle.
                                            </p>
                                        </div>

                                        {/* borderRadius */}
                                        <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                            <h4 className="font-semibold mb-2 text-purple-400">
                                                borderRadius
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Type:</strong>{" "}
                                                <code>number</code>
                                                <br />
                                                <strong>Default:</strong>{" "}
                                                <code>12</code>
                                                <br />
                                                The border radius applied to the
                                                expanded cursor background
                                                shape.
                                            </p>
                                        </div>

                                        {/* dotSpeed */}
                                        <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                            <h4 className="font-semibold mb-2 text-purple-400">
                                                dotSpeed
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Type:</strong>{" "}
                                                <code>number</code>
                                                <br />
                                                <strong>Default:</strong>{" "}
                                                <code>0.15</code>
                                                <br />
                                                The smooth-follow speed of the
                                                cursor dot movement.
                                            </p>
                                        </div>

                                        {/* backgroundColorSpeed */}
                                        <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                            <h4 className="font-semibold mb-2 text-purple-400">
                                                backgroundColorSpeed
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Type:</strong>{" "}
                                                <code>number</code>
                                                <br />
                                                <strong>Default:</strong>{" "}
                                                <code>0.3</code>
                                                <br />
                                                The speed of the transition
                                                between dot and expanded
                                                background.
                                            </p>
                                        </div>

                                        {/* dotOpacity */}
                                        <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                            <h4 className="font-semibold mb-2 text-purple-400">
                                                dotOpacity
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Type:</strong>{" "}
                                                <code>number</code>
                                                <br />
                                                <strong>Default:</strong>{" "}
                                                <code>1</code>
                                                <br />
                                                Opacity of the small cursor dot.
                                            </p>
                                        </div>

                                        {/* backgroundColorOpacity */}
                                        <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                            <h4 className="font-semibold mb-2 text-purple-400">
                                                backgroundColorOpacity
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Type:</strong>{" "}
                                                <code>number</code>
                                                <br />
                                                <strong>Default:</strong>{" "}
                                                <code>1</code>
                                                <br />
                                                Opacity of the blue background
                                                when expanded behind an element.
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
        </>
    );
};

export default page;
