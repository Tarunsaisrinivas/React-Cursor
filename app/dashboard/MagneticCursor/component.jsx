"use client";

import { useEffect, useRef } from "react";

export default function MagneticCursor() {
    const cursorRef = useRef(null);
    const mouse = useRef({ x: 0, y: 0 });
    const pos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Initialize to center after mount
        mouse.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        pos.current = { ...mouse.current };

        const SPEED = 0.15;

        const handleMouseMove = (e) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
        };

        const animate = () => {
            pos.current.x += (mouse.current.x - pos.current.x) * SPEED;
            pos.current.y += (mouse.current.y - pos.current.y) * SPEED;

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
            }

            requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", handleMouseMove);
        requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999]">
            <div
                ref={cursorRef}
                className="absolute w-8 h-8 rounded-full bg-pink-500 mix-blend-difference transition-transform duration-300"
                style={{
                    transform: "translate3d(-9999px, -9999px, 0)",
                }}
            />
        </div>
    );
}
