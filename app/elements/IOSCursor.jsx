"use client";
import { useEffect, useRef, useState } from "react";

export default function IOSCursor({
    dotColor = "#fff",
    backgroundColor = "#007AFF",
    textColor = "white", 
    dotSize = 12,
    borderRadius = 12,
    dotSpeed = 0.15,
    backgroundColorSpeed = 0.3,
    dotOpacity = 1,
    backgroundColorOpacity = 1,
}) {
    const cursorRef = useRef(null);
    const requestRef = useRef();
    const previousTimeRef = useRef();
    const [isMounted, setIsMounted] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(true);

    useEffect(() => {
        const checkTouchDevice = () => {
            const touchDevice =
                "ontouchstart" in window ||
                navigator.maxTouchPoints > 0 ||
                navigator.msMaxTouchPoints > 0;
            setIsTouchDevice(touchDevice);
        };

        checkTouchDevice();
        setIsMounted(true);

        if (isTouchDevice) return;

        const cursor = cursorRef.current;
        if (!cursor) return;

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let isHoveringButton = false;
        let buttonRect = null;

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        let currentHoverTarget = null;

        const animate = (time) => {
            if (previousTimeRef.current !== undefined) {
                if (isHoveringButton && buttonRect) {
                    cursorX = buttonRect.left + buttonRect.width / 2;
                    cursorY = buttonRect.top + buttonRect.height / 2;

                    cursor.style.transform = `translate3d(${buttonRect.left}px, ${buttonRect.top}px, 0) scale(1.1)`;
                    cursor.style.width = `${buttonRect.width}px`;
                    cursor.style.height = `${buttonRect.height}px`;
                    cursor.style.borderRadius = `${borderRadius}px`;
                    cursor.style.backgroundColor = backgroundColor;
                    cursor.style.opacity = backgroundColorOpacity.toString();
                    cursor.style.zIndex = "-0.80";
                    cursor.style.mixBlendMode = "screen";
                } else {
                    cursorX += (mouseX - cursorX) * dotSpeed;
                    cursorY += (mouseY - cursorY) * dotSpeed;

                    cursor.style.transform = `translate3d(${
                        cursorX - dotSize / 2
                    }px, ${cursorY - dotSize / 2}px, 0)`;
                    cursor.style.width = `${dotSize}px`;
                    cursor.style.height = `${dotSize}px`;
                    cursor.style.borderRadius = "50%";
                    cursor.style.backgroundColor = dotColor;
                    cursor.style.opacity = dotOpacity.toString();
                    cursor.style.zIndex = "0";
                }
            }

            previousTimeRef.current = time;
            requestRef.current = requestAnimationFrame(animate);
        };


        const handleMouseOver = (e) => {
            const target = e.target.closest("[data-cursor-hover], button, a");
            if (target) {
                isHoveringButton = true;
                currentHoverTarget = target;
                buttonRect = target.getBoundingClientRect();
                target.dataset.originalColor =
                    target.style.color || window.getComputedStyle(target).color;
                target.dataset.originalZIndex =
                    target.style.zIndex ||
                    window.getComputedStyle(target).zIndex ||
                    "auto";

                target.style.color = textColor;
                target.style.position = "relative";
                target.style.zIndex = "1"; 
                target.style.mixBlendMode = "normal";

                target.classList.add("cursor-hovering");
            }
        };

        const handleMouseOut = (e) => {
            const target = e.target.closest("[data-cursor-hover], button, a");
            if (target) {
                isHoveringButton = false;
                currentHoverTarget = null;
                buttonRect = null;

                target.style.color = textColor;
                target.style.zIndex = target.dataset.originalZIndex || "0";
                target.style.mixBlendMode = "normal";

                target.classList.remove("cursor-hovering");

                delete target.dataset.originalColor;
                delete target.dataset.originalZIndex;
            }
        };

        const handleMouseMoveCheck = (e) => {
            const target = document.getElementById("appearance-button");
            if (target && isHoveringButton) {
                const rect = target.getBoundingClientRect();
                const isOutsideButton =
                    e.clientX < rect.left ||
                    e.clientX > rect.right ||
                    e.clientY < rect.top ||
                    e.clientY > rect.bottom;

                if (isOutsideButton) {
                    isHoveringButton = false;
                    buttonRect = null;
                    target.style.color = textColor;
                    target.style.zIndex = "0";
                    target.style.mixBlendMode = "normal";
                }
            }
        };

        document.body.style.cursor = "none";

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mousemove", handleMouseMoveCheck);
        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", handleMouseOut);

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            document.body.style.cursor = "default";
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mousemove", handleMouseMoveCheck);
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseout", handleMouseOut);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [
        dotColor,
        backgroundColor,
        dotSize,
        borderRadius,
        dotSpeed,
        backgroundColorSpeed,
        dotOpacity,
        backgroundColorOpacity,
        isTouchDevice,
    ]);

    if (!isMounted || isTouchDevice) return null;

    return (
        <div
            ref={cursorRef}
            className="ios-cursor"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: `${dotSize}px`,
                height: `${dotSize}px`,
                backgroundColor: dotColor,
                borderRadius: "50%",
                pointerEvents: "none",
                zIndex: -9, 
                opacity: 1,
                transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                willChange: "transform, width, height, border-radius, opacity",
            }}
        />
    );
}
