"use client";

import LensMagnifier from "../../elements/LensMagnifier";
import CodeSnippetViewer from "@/components/ui/code-snippet-viewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MousePointer2, Github, Bug, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const magnifierUsageCode = `import LensMagnifier from "@/components/LensMagnifier";

export default function Demo() {
  return (
    <div className="p-10 bg-gray-900 min-h-screen flex justify-center items-center">
      <LensMagnifier src="/example.jpg" zoom={2} lensSize={150} />
    </div>
  );
}`;

const magnifierComponentCode = `"use client";
import React, { useRef, useState } from "react";

const LensMagnifier = ({ src, zoom = 2, lensSize = 150 }) => {
  const imgRef = useRef(null);
  const lensRef = useRef(null);
  const [lensVisible, setLensVisible] = useState(false);

  const handleMouseMove = (e) => {
    const img = imgRef.current;
    const lens = lensRef.current;
    if (!img || !lens) return;

    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lensX = x - lensSize / 2;
    const lensY = y - lensSize / 2;

    const maxX = img.width - lensSize;
    const maxY = img.height - lensSize;
    const clampedX = Math.max(0, Math.min(lensX, maxX));
    const clampedY = Math.max(0, Math.min(lensY, maxY));

    lens.style.left = \`\${clampedX}px\`;
    lens.style.top = \`\${clampedY}px\`;
    lens.style.backgroundPosition = \`-\${x * zoom - lensSize / 2}px -\${y * zoom - lensSize / 2}px\`;
  };

  const getBackgroundSize = () => {
    const img = imgRef.current;
    return img ? \`\${img.width * zoom}px \${img.height * zoom}px\` : "0px 0px";
  };

  return (
    <div
      className="relative inline-block"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setLensVisible(true)}
      onMouseLeave={() => setLensVisible(false)}
    >
      <img
        ref={imgRef}
        src={src || "/placeholder.svg"}
        alt="Zoomable"
        className="w-full h-auto object-cover select-none pointer-events-none"
      />
      {lensVisible && imgRef.current && (
        <div
          ref={lensRef}
          className="absolute pointer-events-none border-2 border-purple-500 rounded-full shadow-md"
          style={{
            width: \`\${lensSize}px\`,
            height: \`\${lensSize}px\`,
            backgroundImage: \`url(\${src})\`,
            backgroundRepeat: "no-repeat",
            backgroundSize: getBackgroundSize(),
            zIndex: 50,
          }}
        />
      )}
    </div>
  );
};

export default LensMagnifier;`;

const propsTable = `
Prop       | Type    | Default
-----------|---------|--------
src        | string  | –
zoom       | number  | 2
lensSize   | number  | 150
`;

export default function LensMagnifierPage() {
    const [selectedTab, setSelectedTab] = useState("demo");
    const pathname = usePathname();
    const encodedPath = encodeURIComponent(`[${pathname}]`);
    const issueUrl = `https://github.com/Tarunsaisrinivas/React-Cursor/issues/new?q=label%3A%22Bug%20%F0%9F%90%9B%22&title=[Bug 🪲]${encodedPath}: `;
    const featureUrl = `https://github.com/Tarunsaisrinivas/React-Cursor/issues/new?q=label%3A%22Feature%20%F0%9F%92%A1%22&title=[Feature 💡]${encodedPath}: `;
    return (
        <div className="w-full flex items-center justify-center mx-auto dark:bg-[#171717] p-4">
            <div className="w-full max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 gap-6">
                    {/* Left: Title and Description */}
                    <div className="text-center lg:text-left space-y-4">
                        <div className="flex items-center justify-center lg:justify-start gap-3">
                            <MousePointer2 className="w-10 h-10 text-purple-500" />
                            <h1 className="text-3xl md:text-5xl font-bold text-purple-500">
                                Lens Magnifier Cursor
                            </h1>
                            <Badge variant="secondary" className="text-sm">
                                Interactive
                            </Badge>
                        </div>
                        <p className="text-muted-foreground text-xl max-w-2xl">
                            Hover on the image to magnify that part using a lens
                            effect.
                        </p>
                    </div>

                    {/* Right: Contribute Section */}
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
                            <Heart
                                className={`w-4 h-4 ${
                                    selectedTab === "contribute"
                                        ? "fill-purple-500"
                                        : ""
                                }`}
                            />
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
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="demo">Live Demo</TabsTrigger>
                        <TabsTrigger value="component">Component</TabsTrigger>
                        <TabsTrigger value="usage">Usage</TabsTrigger>
                        <TabsTrigger value="props">Props</TabsTrigger>
                        {/* <TabsTrigger value="contribute">Contribute</TabsTrigger> */}
                    </TabsList>

                    <TabsContent value="demo">
                        <Card className="bg-white/50 dark:bg-[#171717]/50 backdrop-blur-sm border-2">
                            <CardHeader>
                                <CardTitle className="text-xl">
                                    Live Demo
                                </CardTitle>
                                <CardDescription>
                                    Hover over the image below
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center">
                                <div className="w-[400px] h-auto">
                                    <Card>
                                        
                                        <LensMagnifier
                                            src="/city.jpg"
                                            zoom={2.5}
                                            lensSize={100}
                                        />
                                        <CardDescription className="text-sm text-muted-foreground mt-2">
                                            Explore the cityscape up close —
                                            hover over the image to zoom into
                                            buildings, streets, and skyline
                                            details.
                                        </CardDescription>
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="component">
                        <Card>
                            <CardHeader>
                                <CardTitle>LensMagnifier Component</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CodeSnippetViewer
                                    code={magnifierComponentCode}
                                    title="LensMagnifier.jsx"
                                    language="javascript"
                                    maxLines={25}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="usage">
                        <Card>
                            <CardHeader>
                                <CardTitle>Usage Example</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CodeSnippetViewer
                                    code={magnifierUsageCode}
                                    title="Usage in App"
                                    language="javascript"
                                    maxLines={15}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="props">
                        <Card>
                            <CardHeader>
                                <CardTitle>Component Props</CardTitle>
                                <CardDescription>
                                    Props to customize the lens magnifier
                                    behavior
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CodeSnippetViewer
                                    code={propsTable}
                                    title="LensMagnifier Props"
                                    language="markdown"
                                    maxLines={8}
                                />
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
        </div>
    );
}
