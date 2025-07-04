"use client";

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
                    width: `${dotSize}px`,
                    height: `${dotSize}px`,
                    backgroundColor: dotColor,
                    transform: "translate(-50%, -50%)",
                    left: `${renderPos.dot.x}px`,
                    top: `${renderPos.dot.y}px`,
                    willChange: "transform",
                    transition: "transform 0.1s linear",
                    opacity: dotOpacity,
                }}
            />

            <div
                className="absolute rounded-full"
                style={{
                    width: isHovering
                        ? `${hoverBorderSize}px`
                        : `${borderSize}px`,
                    height: isHovering
                        ? `${hoverBorderSize}px`
                        : `${borderSize}px`,
                    border: `${borderWidth}px solid ${borderColor}`,
                    transform: "translate(-50%, -50%)",
                    left: `${renderPos.border.x}px`,
                    top: `${renderPos.border.y}px`,
                    willChange: "width, height, transform",
                    transition:
                        "width 0.3s ease, height 0.3s ease, transform 0.2s ease-out",
                    opacity: borderOpacity,
                }}
            />
        </div>
    );
}
