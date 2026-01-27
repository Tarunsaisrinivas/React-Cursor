"use client";
import { useRef, useState } from "react";

const HoverReveal = ({ frontImage, backImage }) => {
    const containerRef = useRef(null);
    const backImgRef = useRef(null);
    const [hover, setHover] = useState(false);

    const radius = 100;
    let rafId = null;

    const handleMouseMove = (e) => {
        if (!containerRef.current || !backImgRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            backImgRef.current.style.clipPath = `circle(${radius}px at ${x}px ${y}px)`;
        });
    };

    return (
        <div
            ref={containerRef}
            className="relative w-[400px] h-[300px] overflow-hidden rounded-xl"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => {
                setHover(false);
                backImgRef.current.style.clipPath = "circle(0px at 0 0)";
            }}
        >
            {/* Front Image */}
            <img
                src={frontImage}
                alt="Front"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Back Image */}
            <img
                ref={backImgRef}
                src={backImage}
                alt="Back"
                className="absolute inset-0 w-full h-full object-cover transition-[clip-path] duration-300 ease-out"
                style={{
                    clipPath: "circle(0px at 0 0)",
                }}
            />
        </div>
    );
};

export default HoverReveal;
