"use client";
import React, { useRef, useState } from "react";

const LensMagnifier = ({ src, zoom = 2, lensSize = 150 }) => {
    const imgRef = useRef(null);
    const lensRef = useRef(null);
    const [lensVisible, setLensVisible] = useState(false);

    const handleMouseMove = (e) => {
        const img = imgRef.current;
        const lens = lensRef.current;

        if (!img || !lens) return; // ✅ guard clause

        const rect = img.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const lensX = x - lensSize / 2;
        const lensY = y - lensSize / 2;

        const maxX = img.width - lensSize;
        const maxY = img.height - lensSize;
        const clampedX = Math.max(0, Math.min(lensX, maxX));
        const clampedY = Math.max(0, Math.min(lensY, maxY));

        lens.style.left = `${clampedX}px`;
        lens.style.top = `${clampedY}px`;
        lens.style.backgroundPosition = `-${x * zoom - lensSize / 2}px -${
            y * zoom - lensSize / 2
        }px`;
    };

    const getBackgroundSize = () => {
        const img = imgRef.current;
        return img ? `${img.width * zoom}px ${img.height * zoom}px` : "0px 0px";
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

            {/* Show lens only when visible and image is mounted */}
            {lensVisible && imgRef.current && (
                <div
                    ref={lensRef}
                    className="absolute pointer-events-none border-2 border-purple-500 rounded-full shadow-md"
                    style={{
                        width: `${lensSize}px`,
                        height: `${lensSize}px`,
                        backgroundImage: `url(${src})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: getBackgroundSize(),
                        zIndex: 50,
                    }}
                />
            )}
        </div>
    );
};

export default LensMagnifier;
