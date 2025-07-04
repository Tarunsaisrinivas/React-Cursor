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
import FluidSimulation from "../../elements/FluidSimulation";
const page = () => {
    const [selectedTab, setSelectedTab] = useState("demo");
    const demoContainerRef = useRef(null);
    const pathname = usePathname();
    const encodedPath = encodeURIComponent(`[${pathname}]`);
    const issueUrl = `https://github.com/Tarunsaisrinivas/React-Cursor/issues/new?template=bug_report.md&title=[Bug 🪲]: ${encodedPath}:`;
    const featureUrl = `https://github.com/Tarunsaisrinivas/React-Cursor/issues/new?template=feature_request.md&title=[Feature💡]:${encodedPath}: `;

    const FluidSimulationCode = String.raw`"use client";
    
    import { useEffect, useRef } from "react";
    
    class GLProgram {
        constructor(gl, vertexShader, fragmentShader) {
            this.uniforms = {};
            this.program = gl.createProgram();
    
            gl.attachShader(this.program, vertexShader);
            gl.attachShader(this.program, fragmentShader);
            gl.linkProgram(this.program);
    
            if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
                throw gl.getProgramInfoLog(this.program);
            }
    
            const uniformCount = gl.getProgramParameter(
                this.program,
                gl.ACTIVE_UNIFORMS
            );
            for (let i = 0; i < uniformCount; i++) {
                const uniformName = gl.getActiveUniform(this.program, i).name;
                this.uniforms[uniformName] = gl.getUniformLocation(
                    this.program,
                    uniformName
                );
            }
        }
    
        bind(gl) {
            gl.useProgram(this.program);
        }
    }
    
    export default function FluidSimulation({
        splatRadius = 0.0015,
        cursorColorMode = "random",
        containerRef, // Add this prop
        style, // Add this prop
    }) {
        const canvasRef = useRef(null);
        const animationRef = useRef();
    
        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas || !containerRef.current) return;
    
            const container = containerRef.current;
            const resizeCanvas = () => {
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;
            };
            resizeCanvas();
    
            const config = {
                TEXTURE_DOWNSAMPLE: 1,
                DENSITY_DISSIPATION: 0.98,
                VELOCITY_DISSIPATION: 0.99,
                PRESSURE_DISSIPATION: 0.8,
                PRESSURE_ITERATIONS: 25,
                CURL: 28,
                SPLAT_RADIUS: splatRadius,
            };
    
            const pointers = [];
            const splatStack = [];
    
            function createPointer() {
                return {
                    id: -1,
                    x: 0,
                    y: 0,
                    dx: 0,
                    dy: 0,
                    down: false,
                    moved: false,
                    color: [0, 0, 0],
                };
            }
    
            pointers.push(createPointer());
    
            function getWebGLContext(canvas) {
                const params = {
                    alpha: false,
                    depth: false,
                    stencil: false,
                    antialias: false,
                };
                let gl = canvas.getContext("webgl2", params);
                const isWebGL2 = !!gl;
    
                if (!isWebGL2) {
                    gl =
                        canvas.getContext("webgl", params) ||
                        canvas.getContext("experimental-webgl", params);
                }
    
                if (!gl) {
                    alert("WebGL not supported");
                    return null;
                }
    
                let halfFloat;
                let supportLinearFiltering;
    
                if (isWebGL2) {
                    gl.getExtension("EXT_color_buffer_float");
                    supportLinearFiltering = gl.getExtension(
                        "OES_texture_float_linear"
                    );
                } else {
                    halfFloat = gl.getExtension("OES_texture_half_float");
                    supportLinearFiltering = gl.getExtension(
                        "OES_texture_half_float_linear"
                    );
                }
    
                gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
                const halfFloatTexType = isWebGL2
                    ? gl.HALF_FLOAT
                    : halfFloat
                    ? halfFloat.HALF_FLOAT_OES
                    : gl.FLOAT;
    
                function getSupportedFormat(gl, internalFormat, format, type) {
                    return { internalFormat, format };
                }
    
                let formatRGBA, formatRG, formatR;
    
                if (isWebGL2) {
                    formatRGBA = getSupportedFormat(
                        gl,
                        gl.RGBA16F,
                        gl.RGBA,
                        halfFloatTexType
                    );
                    formatRG = getSupportedFormat(
                        gl,
                        gl.RG16F,
                        gl.RG,
                        halfFloatTexType
                    );
                    formatR = getSupportedFormat(
                        gl,
                        gl.R16F,
                        gl.RED,
                        halfFloatTexType
                    );
                } else {
                    formatRGBA = getSupportedFormat(
                        gl,
                        gl.RGBA,
                        gl.RGBA,
                        halfFloatTexType
                    );
                    formatRG = getSupportedFormat(
                        gl,
                        gl.RGBA,
                        gl.RGBA,
                        halfFloatTexType
                    );
                    formatR = getSupportedFormat(
                        gl,
                        gl.RGBA,
                        gl.RGBA,
                        halfFloatTexType
                    );
                }
    
                return {
                    gl,
                    ext: {
                        formatRGBA,
                        formatRG,
                        formatR,
                        halfFloatTexType,
                        supportLinearFiltering,
                    },
                };
            }
    
            const { gl, ext } = getWebGLContext(canvas);
    
            function compileShader(type, source) {
                const shader = gl.createShader(type);
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
    
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    throw gl.getShaderInfoLog(shader);
                }
                return shader;
            }
    
            const baseVertexShader = compileShader(
                gl.VERTEX_SHADER,
                \`\
          precision highp float;
          precision mediump sampler2D;
          attribute vec2 aPosition;
          varying vec2 vUv;
          varying vec2 vL;
          varying vec2 vR;
          varying vec2 vT;
          varying vec2 vB;
          uniform vec2 texelSize;
          void main () {
              vUv = aPosition * 0.5 + 0.5;
              vL = vUv - vec2(texelSize.x, 0.0);
              vR = vUv + vec2(texelSize.x, 0.0);
              vT = vUv + vec2(0.0, texelSize.y);
              vB = vUv - vec2(0.0, texelSize.y);
              gl_Position = vec4(aPosition, 0.0, 1.0);
          }
        \`
            );
    
            const displayShader = compileShader(
                gl.FRAGMENT_SHADER,
                \`\
          precision highp float;
          varying vec2 vUv;
          uniform sampler2D uTexture;
          void main () {
              gl_FragColor = texture2D(uTexture, vUv);
          }
        \`
            );
    
            const splatShader = compileShader(
                gl.FRAGMENT_SHADER,
                \`\
          precision highp float;
          precision mediump sampler2D;
          varying vec2 vUv;
          uniform sampler2D uTarget;
          uniform float aspectRatio;
          uniform vec3 color;
          uniform vec2 point;
          uniform float radius;
          void main () {
              vec2 p = vUv - point.xy;
              p.x *= aspectRatio;
              vec3 splat = exp(-dot(p, p) / radius) * color;
              vec3 base = texture2D(uTarget, vUv).xyz;
              gl_FragColor = vec4(base + splat, 1.0);
          }
        \`\
            );
    
            const advectionShader = compileShader(
                gl.FRAGMENT_SHADER,
                \`\
          precision highp float;
          precision mediump sampler2D;
          varying vec2 vUv;
          uniform sampler2D uVelocity;
          uniform sampler2D uSource;
          uniform vec2 texelSize;
          uniform float dt;
          uniform float dissipation;
          void main () {
              vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
              gl_FragColor = dissipation * texture2D(uSource, coord);
              gl_FragColor.a = 1.0;
          }
        \`
            );
    
            if (
                !baseVertexShader ||
                !displayShader ||
                !splatShader ||
                !advectionShader
            ) {
                console.error("Failed to compile shaders");
                return;
            }
    
            const displayProgram = new GLProgram(
                gl,
                baseVertexShader,
                displayShader
            );
            const splatProgram = new GLProgram(gl, baseVertexShader, splatShader);
            const advectionProgram = new GLProgram(
                gl,
                baseVertexShader,
                advectionShader
            );
    
            function createFBO(texId, w, h, internalFormat, format, type, param) {
                gl.activeTexture(gl.TEXTURE0 + texId);
                const texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
                gl.texParameteri(
                    gl.TEXTURE_2D,
                    gl.TEXTURE_WRAP_S,
                    gl.CLAMP_TO_EDGE
                );
                gl.texParameteri(
                    gl.TEXTURE_2D,
                    gl.TEXTURE_WRAP_T,
                    gl.CLAMP_TO_EDGE
                );
                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,
                    internalFormat,
                    w,
                    h,
                    0,
                    format,
                    type,
                    null
                );
    
                const fbo = gl.createFramebuffer();
                gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
                gl.framebufferTexture2D(
                    gl.FRAMEBUFFER,
                    gl.COLOR_ATTACHMENT0,
                    gl.TEXTURE_2D,
                    texture,
                    0
                );
                gl.viewport(0, 0, w, h);
                gl.clear(gl.COLOR_BUFFER_BIT);
    
                return [texture, fbo, texId];
            }
    
            function createDoubleFBO(
                texId,
                w,
                h,
                internalFormat,
                format,
                type,
                param
            ) {
                let fbo1 = createFBO(
                    texId,
                    w,
                    h,
                    internalFormat,
                    format,
                    type,
                    param
                );
                let fbo2 = createFBO(
                    texId + 1,
                    w,
                    h,
                    internalFormat,
                    format,
                    type,
                    param
                );
    
                return {
                    get read() {
                        return fbo1;
                    },
                    get write() {
                        return fbo2;
                    },
                    swap() {
                        const temp = fbo1;
                        fbo1 = fbo2;
                        fbo2 = temp;
                    },
                };
            }
    
            let textureWidth = gl.drawingBufferWidth >> config.TEXTURE_DOWNSAMPLE;
            let textureHeight = gl.drawingBufferHeight >> config.TEXTURE_DOWNSAMPLE;
    
            const texType = ext.halfFloatTexType;
            const rgba = ext.formatRGBA;
            const rg = ext.formatRG;
    
            const density = createDoubleFBO(
                2,
                textureWidth,
                textureHeight,
                rgba.internalFormat,
                rgba.format,
                texType,
                ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST
            );
            const velocity = createDoubleFBO(
                0,
                textureWidth,
                textureHeight,
                rg.internalFormat,
                rg.format,
                texType,
                ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST
            );
    
            const blit = (() => {
                gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
                gl.bufferData(
                    gl.ARRAY_BUFFER,
                    new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
                    gl.STATIC_DRAW
                );
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
                gl.bufferData(
                    gl.ELEMENT_ARRAY_BUFFER,
                    new Uint16Array([0, 1, 2, 0, 2, 3]),
                    gl.STATIC_DRAW
                );
                gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(0);
    
                return (destination) => {
                    gl.bindFramebuffer(gl.FRAMEBUFFER, destination);
                    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
                };
            })();
    
            function splat(x, y, dx, dy, color) {
                splatProgram.bind(gl);
                gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read[2]);
                gl.uniform1f(
                    splatProgram.uniforms.aspectRatio,
                    canvas.width / canvas.height
                );
                gl.uniform2f(
                    splatProgram.uniforms.point,
                    x / canvas.width,
                    1.0 - y / canvas.height
                );
                gl.uniform3f(splatProgram.uniforms.color, dx, -dy, 1.0);
                gl.uniform1f(splatProgram.uniforms.radius, config.SPLAT_RADIUS);
                blit(velocity.write[1]);
                velocity.swap();
    
                gl.uniform1i(splatProgram.uniforms.uTarget, density.read[2]);
                gl.uniform3f(
                    splatProgram.uniforms.color,
                    color[0] * 0.3,
                    color[1] * 0.3,
                    color[2] * 0.3
                );
                blit(density.write[1]);
                density.swap();
            }
    
            function multipleSplats(amount) {
                for (let i = 0; i < amount; i++) {
                    const color = [
                        Math.random() * 10,
                        Math.random() * 10,
                        Math.random() * 10,
                    ];
                    const x = canvas.width * Math.random();
                    const y = canvas.height * Math.random();
                    const dx = 1000 * (Math.random() - 0.5);
                    const dy = 1000 * (Math.random() - 0.5);
                    splat(x, y, dx, dy, color);
                }
            }
    
            let lastTime = Date.now();
    
            function update() {
                const dt = Math.min((Date.now() - lastTime) / 1000, 0.016);
                lastTime = Date.now();
    
                if (
                    canvas.width !== window.innerWidth ||
                    canvas.height !== window.innerHeight
                ) {
                    resizeCanvas();
                    textureWidth =
                        gl.drawingBufferWidth >> config.TEXTURE_DOWNSAMPLE;
                    textureHeight =
                        gl.drawingBufferHeight >> config.TEXTURE_DOWNSAMPLE;
                }
    
                gl.viewport(0, 0, textureWidth, textureHeight);
    
                if (splatStack.length > 0) {
                    multipleSplats(splatStack.pop());
                }
    
                advectionProgram.bind(gl);
                gl.uniform2f(
                    advectionProgram.uniforms.texelSize,
                    1.0 / textureWidth,
                    1.0 / textureHeight
                );
                gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read[2]);
                gl.uniform1i(advectionProgram.uniforms.uSource, density.read[2]);
                gl.uniform1f(advectionProgram.uniforms.dt, dt);
                gl.uniform1f(
                    advectionProgram.uniforms.dissipation,
                    config.DENSITY_DISSIPATION
                );
                blit(density.write[1]);
                density.swap();
    
                for (let i = 0; i < pointers.length; i++) {
                    const pointer = pointers[i];
                    if (pointer.moved) {
                        splat(
                            pointer.x,
                            pointer.y,
                            pointer.dx,
                            pointer.dy,
                            pointer.color
                        );
                        pointer.moved = false;
                    }
                }
    
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                displayProgram.bind(gl);
                gl.uniform1i(displayProgram.uniforms.uTexture, density.read[2]);
                blit(null);
    
                animationRef.current = requestAnimationFrame(update);
            }
    
            const handleMouseMove = (e) => {
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
    
                const pointer = pointers[0];
                pointer.dx = (x - pointer.x) * 1.2;
                pointer.dy = (y - pointer.y) * 1.2;
                pointer.x = x;
                pointer.y = y;
                pointer.moved = true;
    
                if (cursorColorMode === "random") {
                    pointer.color = [
                        Math.random() + 0.2,
                        Math.random() + 0.2,
                        Math.random() + 0.2,
                    ];
                } else if (Array.isArray(cursorColorMode)) {
                    pointer.color = cursorColorMode;
                }
            };
    
            const handleMouseDown = () => {
                pointers[0].down = true;
                pointers[0].color = [
                    Math.random() + 0.2,
                    Math.random() + 0.2,
                    Math.random() + 0.2,
                ];
            };
    
            const handleMouseUp = () => {
                pointers[0].down = false;
            };
    
            canvas.addEventListener("mousemove", handleMouseMove);
            canvas.addEventListener("mousedown", handleMouseDown);
            container.addEventListener("mousemove", handleMouseMove);
            canvas.addEventListener("mouseup", handleMouseUp);
            window.addEventListener("resize", resizeCanvas);
    
            update();
    
            return () => {
                container.removeEventListener("mousemove", handleMouseMove);
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }
                canvas.removeEventListener("mousemove", handleMouseMove);
                canvas.removeEventListener("mousedown", handleMouseDown);
                canvas.removeEventListener("mouseup", handleMouseUp);
                window.removeEventListener("resize", resizeCanvas);
            };
        }, [splatRadius, cursorColorMode]);
    
        return (
            <canvas
                ref={canvasRef}
                style={{
                    ...style,
                    display: "block",
                    background: "transparent",
                    pointerEvents: "none",
                }}
            />
        );
    }
    `;
    const FluidSimulationUsage = `"use client";
    import FluidSimulation from "./FluidSimulation";
    export default function App() {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
              <FluidSimulation
                    splatRadius={0.001}
                    cursorColorMode="random"
                    containerRef={demoContainerRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                    }}
                    />
            </div>
        );
    }
    `;
    const FluidSimulationProps = `
| Prop Name           | Type                        | Default Value |
| --------------------| ----------------------------| ------------- |
| splatRadius         | number                      | 0.0015        |
| cursorColorMode     | Array<number> or "random"   | "random"      |
| textureDownsample   | number                      | 1             |
| densityDissipation  | number                      | 0.98          |
| velocityDissipation | number                      | 0.99          |
| pressureDissipation | number                      | 0.8           |
| pressureIterations  | number                      | 25            |
| curl                | number                      | 28            |

    `;

    const FluidSimulationColor = `
Emoji  Color Name  cursorColorMode Value       Example Usage                         
------------------------------------------------------------------------------------
 🔴     Red         [1.0, 0.0, 0.0]            cursorColorMode={[1.0, 0.0, 0.0]}        
 🟢     Green       [0.0, 1.0, 0.0]            cursorColorMode={[0.0, 1.0, 0.0]}    
 🔵     Blue        [0.0, 0.0, 1.0]            cursorColorMode={[0.0, 0.0, 1.0]}    
 🟡     Yellow      [1.0, 1.0, 0.0]            cursorColorMode={[1.0, 1.0, 0.0]}    
 🟣     Magenta     [1.0, 0.0, 1.0]            cursorColorMode={[1.0, 0.0, 1.0]}    
 🟠     Orange      [1.0, 0.5, 0.0]            cursorColorMode={[1.0, 0.5, 0.0]}    
 🟤     Brown       [0.6, 0.3, 0.0]            cursorColorMode={[0.6, 0.3, 0.0]}    
 ⚪     White       [1.0, 1.0, 1.0]            cursorColorMode={[1.0, 1.0, 1.0]}    
 ⚫     Black       [0.0, 0.0, 0.0]            ⚠️ Invisible on dark backgrounds     
 💗     Pink        [1.0, 0.6, 0.8]            cursorColorMode={[1.0, 0.6, 0.8]}    
 🧊     Cyan        [0.0, 1.0, 1.0]            cursorColorMode={[0.0, 1.0, 1.0]}    
 🧪     Teal        [0.0, 0.5, 0.5]            cursorColorMode={[0.0, 0.5, 0.5]}    
 💚     Lime        [0.6, 1.0, 0.0]            cursorColorMode={[0.6, 1.0, 0.0]}    
 🧡     Coral       [1.0, 0.4, 0.3]            cursorColorMode={[1.0, 0.4, 0.3]}    
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
                                Fluid Simulation Cursor
                            </h1>
                            <Badge variant="secondary" className="text-sm">
                                Interactive
                            </Badge>
                        </div>
                        <p className="text-muted-foreground text-xl max-w-2xl mx-auto lg:mx-0">
                            Move your mouse around to see the Fluid Simulation
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
                                    Fluid Simulation Cursor
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div
                                    ref={demoContainerRef}
                                    className="min-h-[400px]  rounded-xl border-2 border-dashed border-purple-300/50 flex items-center justify-center relative overflow-hidden"
                                >
                                    {/* Fluid Simulation constrained to this container */}
                                    <div className="absolute inset-0">
                                        <FluidSimulation
                                            splatRadius={0.001}
                                            cursorColorMode="random"
                                            containerRef={demoContainerRef}
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                            }}
                                        />
                                    </div>

                                    <div className="text-center space-y-6 z-10">
                                        <div className="text-8xl">🖱️</div>
                                        <div className="space-y-2">
                                            <p className="text-2xl font-bold text-white">
                                                Move your mouse here!
                                            </p>
                                            <p className="text-violet-300 text-lg">
                                                Fluid Simulation Cursor will follow
                                                your cursor
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="component" className="space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl">
                                        Fluid Simulation Cursor
                                    </CardTitle>
                                    <CardDescription>
                                        Complete component implementation
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CodeSnippetViewer
                                    code={FluidSimulationCode}
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
                                        How to implement the Fluid Simulation
                                        Cursor in your app
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CodeSnippetViewer
                                    code={FluidSimulationUsage}
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
                                <CardTitle>Color Props</CardTitle>
                                <CardDescription>
                                    Usage of Colors
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CodeSnippetViewer
                                    code={FluidSimulationColor}
                                    title="Color Props Usage"
                                    language="bash"
                                    maxLines={5}
                                />
                            </CardContent>
                        </Card>
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
                                    code={FluidSimulationProps}
                                    title="FluidSimulation Props"
                                    language="typescript"
                                    maxLines={10}
                                />
                                <div className="mt-6 space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {/* splatRadius */}
                                        <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                            <h4 className="font-semibold mb-2 text-purple-400">
                                                splatRadius
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Type:</strong>{" "}
                                                <code>number</code>
                                                <br />
                                                <strong>Default:</strong>{" "}
                                                <code>0.0015</code>
                                                <br />
                                                The size of each fluid splat
                                                (bigger = more spread).
                                            </p>
                                        </div>

                                        {/* cursorColorMode */}
                                        <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                            <h4 className="font-semibold mb-2 text-purple-400">
                                                cursorColorMode
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Type:</strong>{" "}
                                                <code>Array&lt;number&gt;</code>{" "}
                                                or <code>"random"</code>
                                                <br />
                                                <strong>Default:</strong>{" "}
                                                <code>"random"</code>
                                                <br />
                                                Sets a fixed RGB color for the
                                                cursor splat effect, or random
                                                if not provided.
                                            </p>
                                        </div>

                                        {/* textureDownsample */}
                                        <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                            <h4 className="font-semibold mb-2 text-purple-400">
                                                textureDownsample
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Type:</strong>{" "}
                                                <code>number</code>
                                                <br />
                                                <strong>Default:</strong>{" "}
                                                <code>1</code>
                                                <br />
                                                Lower values increase resolution
                                                but reduce performance.
                                            </p>
                                        </div>

                                        {/* densityDissipation */}
                                        <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                            <h4 className="font-semibold mb-2 text-purple-400">
                                                densityDissipation
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Type:</strong>{" "}
                                                <code>number</code>
                                                <br />
                                                <strong>Default:</strong>{" "}
                                                <code>0.98</code>
                                                <br />
                                                Controls how quickly the fluid
                                                fades out.
                                            </p>
                                        </div>

                                        {/* velocityDissipation */}
                                        <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                            <h4 className="font-semibold mb-2 text-purple-400">
                                                velocityDissipation
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Type:</strong>{" "}
                                                <code>number</code>
                                                <br />
                                                <strong>Default:</strong>{" "}
                                                <code>0.99</code>
                                                <br />
                                                Controls how quickly velocity
                                                fields (motion) fade.
                                            </p>
                                        </div>

                                        {/* pressureDissipation */}
                                        <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                            <h4 className="font-semibold mb-2 text-purple-400">
                                                pressureDissipation
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Type:</strong>{" "}
                                                <code>number</code>
                                                <br />
                                                <strong>Default:</strong>{" "}
                                                <code>0.8</code>
                                                <br />
                                                Controls how fast pressure
                                                dissipates.
                                            </p>
                                        </div>

                                        {/* pressureIterations */}
                                        <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                            <h4 className="font-semibold mb-2 text-purple-400">
                                                pressureIterations
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Type:</strong>{" "}
                                                <code>number</code>
                                                <br />
                                                <strong>Default:</strong>{" "}
                                                <code>25</code>
                                                <br />
                                                Number of solver iterations for
                                                pressure simulation.
                                            </p>
                                        </div>

                                        {/* curl */}
                                        <div className="border rounded-xl p-4 bg-[#171717] backdrop-blur-sm border-purple-400 shadow-md">
                                            <h4 className="font-semibold mb-2 text-purple-400">
                                                curl
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Type:</strong>{" "}
                                                <code>number</code>
                                                <br />
                                                <strong>Default:</strong>{" "}
                                                <code>28</code>
                                                <br />
                                                How much swirling (vortex-like)
                                                motion occurs.
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
