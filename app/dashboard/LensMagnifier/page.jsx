"use client";

import LensMagnifier from "./component";
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
import { MousePointer2 } from "lucide-react";

// --- code snippets ---
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
        src={src}
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
Prop	 |  Type	| Default
------------------------------
src	     |  string	|   –	    
zoom	 |  number	|   2	    
lensSize |	number	|  150
`;

export default function LensMagnifierPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center mx-auto dark:bg-[#171717] p-4">
            <div className="w-full max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <MousePointer2 className="w-12 h-12 text-purple-500" />
                        <h1 className="text-3xl md:text-5xl font-bold text-purple-500 ">
                            Lens Magnifier Cursor
                        </h1>
                        <Badge variant="secondary" className="text-sm">
                            Interactive
                        </Badge>
                    </div>
                    <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                        Hover on the image to magnify that part using a lens
                        effect.
                    </p>
                </div>

                <Tabs defaultValue="demo" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="demo">Live Demo</TabsTrigger>
                        <TabsTrigger value="component">Component</TabsTrigger>
                        <TabsTrigger value="usage">Usage</TabsTrigger>
                        <TabsTrigger value="props">Props</TabsTrigger>
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
                                    <LensMagnifier
                                        src="/city.jpg"
                                        zoom={2.5}
                                        lensSize={100}
                                    />
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
                                    language="typescript"
                                    maxLines={8}
                                />
                                <div className="mt-6 space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="border rounded-xl p-4 bg-[#171717] border-purple-400 shadow-md">
                                            <h4 className="font-semibold mb-2 text-purple-400">
                                                src
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Image source URL/path to apply
                                                the lens magnifier effect.
                                            </p>
                                        </div>
                                        <div className="border rounded-xl p-4 bg-[#171717] border-purple-400 shadow-md">
                                            <h4 className="font-semibold mb-2 text-purple-400">
                                                zoom
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Zoom level multiplier. For
                                                example, 2 = 200% zoom. Default:
                                                2.
                                            </p>
                                        </div>
                                        <div className="border rounded-xl p-4 bg-[#171717] border-purple-400 shadow-md">
                                            <h4 className="font-semibold mb-2 text-purple-400">
                                                lensSize
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Diameter of the magnifying lens
                                                in pixels. Default: 150.
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
}
