"use client";

import React, { useEffect, useRef } from "react";

export default function SmokeCursor() {
    const containerRef = useRef();

    useEffect(() => {
        const container = containerRef.current;

        const createSmoke = (x, y) => {
            const smoke = document.createElement("div");
            smoke.className = "smoke-puff";

            smoke.style.left = `${x}px`;
            smoke.style.top = `${y}px`;

            // Randomize movement
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * 40 + 10;

            const translateX = Math.cos(angle) * distance;
            const translateY = Math.sin(angle) * distance;

            smoke.style.setProperty("--dx", `${translateX}px`);
            smoke.style.setProperty("--dy", `${translateY}px`);

            container.appendChild(smoke);

            setTimeout(() => {
                smoke.remove();
            }, 1000); // Remove after fade
        };

        const handleMove = (e) => {
            createSmoke(e.clientX, e.clientY);
        };

        window.addEventListener("mousemove", handleMove);
        return () => {
            window.removeEventListener("mousemove", handleMove);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="pointer-events-none fixed inset-0 z-[9999]"
        />
    );
}
