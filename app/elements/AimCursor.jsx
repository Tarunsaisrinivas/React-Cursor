"use client";

import { useRef, useEffect, useState } from "react";

export default function AimCursor({ stroke = "#AD46FF" }) {
    const canvasRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 400, y: 300 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = 800;
        canvas.height = 600;

        const handleMouseMove = (e) => {
            if (!isHovering) return;
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
    }, [isHovering]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

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
    }, [mousePos, stroke]);

    return (
        <canvas
            ref={canvasRef}
            className={`w-full h-fit bg-[#171717] ${isHovering ? "cursor-none" : "cursor-default"}`}
            style={{ maxWidth: "auto", height: "auto" }}
        />
    );
}