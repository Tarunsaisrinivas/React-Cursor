"use client";

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
            `
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
    `
        );

        const displayShader = compileShader(
            gl.FRAGMENT_SHADER,
            `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      void main () {
          gl_FragColor = texture2D(uTexture, vUv);
      }
    `
        );

        const splatShader = compileShader(
            gl.FRAGMENT_SHADER,
            `
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
    `
        );

        const advectionShader = compileShader(
            gl.FRAGMENT_SHADER,
            `
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
    `
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
