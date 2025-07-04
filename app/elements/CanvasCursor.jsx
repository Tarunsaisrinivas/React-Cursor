"use client";
import React from "react";
import useCanvasCursor from "@/hooks/useCanvasCursor";

export default function CanvasCursorComponent() {
  useCanvasCursor();

  return (
    <canvas
      id="canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}
