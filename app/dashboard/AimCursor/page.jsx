"use client";

import CodeSnippetViewer from "@/components/ui/code-snippet-viewer";
import AimCursor from "./component";
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
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
export default function CodeExamples() {
     const [selectedTab, setSelectedTab] = useState("demo");
        const pathname = usePathname();
        const encodedPath = encodeURIComponent(`[${pathname}]`);
        const issueUrl = `https://github.com/Tarunsaisrinivas/React-Cursor/issues/new?q=label%3A%22Bug%20%F0%9F%90%9B%22&title=[Bug 🪲]${encodedPath}: `;
        const featureUrl = `https://github.com/Tarunsaisrinivas/React-Cursor/issues/new?q=label%3A%22Feature%20%F0%9F%92%A1%22&title=[Feature 💡]${encodedPath}: `;
    
    const AimCursorCode = `"use client";
  
  import { useRef, useEffect, useState } from "react";
  
  export default function AimCursor({ stroke = "#AD46FF" }) {
    const canvasRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
  
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
  
      canvas.width = 800;
      canvas.height = 600;
  
      const handleMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        setMousePos({ x, y });
      };
  
      const handleMouseEnter = () => setIsHovering(true);
      const handleMouseLeave = () => setIsHovering(false);
  
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseenter", handleMouseEnter);
      canvas.addEventListener("mouseleave", handleMouseLeave);
  
      return () => {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseenter", handleMouseEnter);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, []);
  
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      if (isHovering) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 15, 0, Math.PI * 2);
        ctx.stroke();
  
        ctx.fillStyle = stroke;
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 3, 0, Math.PI * 2);
        ctx.fill();
  
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(mousePos.x - 25, mousePos.y);
        ctx.lineTo(mousePos.x + 25, mousePos.y);
        ctx.moveTo(mousePos.x, mousePos.y - 25);
        ctx.lineTo(mousePos.x, mousePos.y + 25);
        ctx.stroke();
      }
    }, [mousePos, isHovering, stroke]);
  
    return (
      <canvas
        ref={canvasRef}
        className={\`w-full h-fit bg-[#171717] \${isHovering ? "cursor-none" : "cursor-default"
        }\`}
        style={{ maxWidth: "auto", height: "auto" }}
      />
    );
  }
  
`;

    const AimCursorUsage = `import AimCursor from "./AimCursor";

export default function App() {
  return (
    <>
      <AimCursor stroke="#AD46FF" />
      <div className="p-8">
        <h1 className="text-3xl font-bold">
          Take Mouse towards the white background!
        </h1>
      </div>
    </>
  );
}
`;

    const propsCode = `// Props for AimCursor component

<AimCursor stroke="#AD46FF" />
`;

    return (
        // <div className="min-h-screen w-full flex items-center justify-center mx-auto dark:bg-[#171717] p-4">
        //   <div className="w-full max-w-7xl mx-auto">
        //     <div className="text-center mb-12">
        //       <div className="flex items-center justify-center gap-3 mb-6">
        //         <MousePointer2 className="w-12 h-12 text-purple-500" />
        //         <h1 className="text-3xl md:text-5xl font-bold text-purple-500">
        //           Aim Cursor Effect
        //         </h1>
        //         <Badge variant="secondary" className="text-sm">
        //           Interactive
        //         </Badge>
        //       </div>

        //       <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
        //         Move your mouse around to see the aim cursor in action!
        //       </p>
        //     </div>
        <div className="w-full flex flex-col items-center justify-center dark:bg-[#171717] p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 gap-6 w-full">
                <div className="text-center lg:text-left space-y-4">
                    <div className="flex items-center justify-center lg:justify-start gap-3">
                        <MousePointer2 className="w-10 h-10 text-purple-500" />
                        <h1 className="text-3xl md:text-5xl font-bold text-purple-500">
                            Aim Cursor Effect
                        </h1>
                        <Badge variant="secondary" className="text-sm">
                            Interactive
                        </Badge>
                    </div>
                    <p className="text-muted-foreground text-xl max-w-2xl mx-auto lg:mx-0">
                        Move your mouse around to see the aim cursor in action!
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
                    <TabsTrigger value="usage">Usage</TabsTrigger>
                    <TabsTrigger value="props">Props</TabsTrigger>
                </TabsList>

                <TabsContent value="demo" className="space-y-6">
                    <Card className="bg-white/50 dark:bg-[#171717]/50 backdrop-blur-sm border-2">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">
                                Interactive Demo
                            </CardTitle>
                            <CardDescription className="text-lg">
                                Move your cursor around this area to see the aim
                                effect
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="min-h-[400px] rounded-xl border-2 border-dashed border-purple-300/50 flex items-center justify-center relative overflow-hidden bg-white dark:bg-[#171717]">
                                {/* Aim Cursor is rendered only inside this tab */}
                                <AimCursor stroke="#AD46FF" />

                                {/* Decorative grid */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="component" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">
                                AimCursor.jsx
                            </CardTitle>
                            <CardDescription>
                                Full source code of the component
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CodeSnippetViewer
                                code={AimCursorCode}
                                title="AimCursor.jsx"
                                language="javascript"
                                maxLines={25}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="usage" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Usage Example</CardTitle>
                            <CardDescription>
                                How to include the component in your project
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CodeSnippetViewer
                                code={AimCursorUsage}
                                title="App.jsx"
                                language="javascript"
                                maxLines={15}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="props" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Component Props</CardTitle>
                            <CardDescription>
                                You can customize the component using the
                                following prop.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CodeSnippetViewer
                                code={propsCode}
                                title="Props"
                                language="jsx"
                                maxLines={5}
                            />
                            <div className="mt-6 grid gap-4 md:grid-cols-2">
                                <div className="border rounded-xl p-4 bg-[#171717] border-purple-400 shadow-md">
                                    <h4 className="font-semibold mb-2 text-purple-400">
                                        stroke
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        Sets the color of the aim ring, dot, and
                                        crosshair. Accepts any valid CSS color
                                        string (e.g., <code>#AD46FF</code>,
                                        <code>red</code>).
                                    </p>
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
}
