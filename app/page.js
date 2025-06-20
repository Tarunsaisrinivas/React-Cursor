"use client";
import { useEffect, useState } from "react";
import React from "react";

import { ArrowRight, Sparkles, Zap, Palette } from "lucide-react";
import Navbar from "./containers/Navbar";
import Link from "next/link";

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 overflow-hidden">      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                New Components Available
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                A collection of{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  modern cursor
                </span>{" "}
                components with smooth animations
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Transform your user experience with beautifully crafted cursor
                interactions. From subtle hover effects to dynamic trail
                animations, our components bring your interface to life with
                smooth, performant animations that delight users.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>20+ Pre-built cursor components</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Smooth 60fps animations</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>
                  Crafted with Shadcn UI and animated seamlessly using GSAP.
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
              <button className="group inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              </Link>
              <button className="inline-flex items-center gap-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300">
                View Examples
              </button>
            </div>
          </div>

          {/* Right Content - Rhombus Animations */}
          <div className="relative flex justify-center items-center h-[600px]">
            {/* Rhombus 1 - Spiral Cursor */}
            <div className="absolute top-0 right-5">
              <RhombusDemo
                type="spiral"
                color="from-orange-500 to-red-500"
                icon={<Palette className="w-6 h-6" />}
                title="Spiral Motion"
              />
            </div>

            {/* Rhombus 2 - Bounce Cursor */}
            <div className="absolute top-32 left-0">
              <RhombusDemo
                type="bounce"
                color="from-indigo-500 to-purple-500"
                icon={<Zap className="w-6 h-6" />}
                title="Bounce Effect"
              />
            </div>

            {/* Rhombus 3 - Wave Cursor */}
            <div className="absolute bottom-0 right-12">
              <RhombusDemo
                type="wave"
                color="from-teal-500 to-blue-500"
                icon={<Sparkles className="w-6 h-6" />}
                title="Wave Motion"
              />
            </div>

            {/* Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <defs>
                <linearGradient
                  id="lineGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#F97316" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              <path
                d="M 200 100 Q 150 200 100 300 Q 200 400 300 500"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="8,4"
                className="animate-pulse"
              />
              <circle
                cx="200"
                cy="100"
                r="3"
                fill="#F97316"
                className="animate-ping"
              />
              <circle
                cx="100"
                cy="300"
                r="3"
                fill="#8B5CF6"
                className="animate-ping"
                style={{ animationDelay: "0.5s" }}
              />
              <circle
                cx="300"
                cy="500"
                r="3"
                fill="#06B6D4"
                className="animate-ping"
                style={{ animationDelay: "1s" }}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Our Cursor Components?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Built with performance and accessibility in mind, our components
            work seamlessly across all modern browsers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Lightning Fast"
            description="Optimized animations that run at 60fps without impacting performance"
            gradient="from-yellow-400 to-orange-500"
          />
          <FeatureCard
            icon={<Palette className="w-8 h-8" />}
            title="Highly Customizable"
            description="Easy to customize colors, sizes, and animation properties to match your brand"
            gradient="from-purple-400 to-pink-500"
          />
          <FeatureCard
            icon={<Sparkles className="w-8 h-8" />}
            title="Modern Design"
            description="Contemporary cursor effects that enhance user engagement and interaction"
            gradient="from-blue-400 to-cyan-500"
          />
        </div>
      </div>
    </div>
    </>
  );
}

// Rhombus Demo Component
function RhombusDemo({ type, color, icon, title }) {
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    let animationId;
    let trailId = 0;

    const animate = () => {
      setCursorPos((prev) => {
        let newX, newY;

        switch (type) {
          case "spiral":
            // Spiral motion
            const spiralTime = Date.now() * 0.003;
            const radius = 20 + Math.sin(spiralTime * 0.5) * 15;
            newX = 50 + Math.cos(spiralTime) * radius;
            newY = 50 + Math.sin(spiralTime) * radius;
            break;
          case "bounce":
            // Bouncing motion
            const bounceTime = Date.now() * 0.004;
            newX = 50 + Math.sin(bounceTime) * 35;
            newY = 30 + Math.abs(Math.sin(bounceTime * 2)) * 40;
            break;
          case "wave":
            // Wave-like motion
            const waveTime = Date.now() * 0.002;
            newX = 20 + (Math.sin(waveTime) + 1) * 30;
            newY = 50 + Math.sin(waveTime * 3) * 20;
            break;
          default:
            newX = prev.x;
            newY = prev.y;
        }

        // Add trail effect for bounce type instead of trail
        if (type === "bounce") {
          setTrail((prevTrail) => {
            const newTrail = [
              ...prevTrail,
              { x: newX, y: newY, id: trailId++ },
            ];
            return newTrail.slice(-6); // Keep last 6 positions
          });
        }

        return { x: newX, y: newY };
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [type]);

  return (
    <div className="relative group">
      {/* Rhombus Container */}
      <div
        className={`w-48 h-48 bg-gradient-to-br ${color} rounded-3xl rotate-45 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 relative overflow-hidden`}
      >
        {/* Inner content area */}
        <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-2xl -rotate-45 flex flex-col items-center justify-center">
          <div className="text-white mb-2">{icon}</div>
          <span className="text-white text-sm font-semibold">{title}</span>
        </div>

        {/* Animated cursor */}
        <div
          className="absolute w-3 h-3 bg-white rounded-full shadow-lg transition-all duration-100 -rotate-45"
          style={{
            left: `${cursorPos.x}%`,
            top: `${cursorPos.y}%`,
            transform: "translate(-50%, -50%) rotate(-45deg)",
          }}
        >
          {/* Cursor glow effect */}
          <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></div>
        </div>

        {/* Trail effect for bounce type */}
        {type === "bounce" &&
          trail.map((point, index) => (
            <div
              key={point.id}
              className="absolute w-2 h-2 bg-white rounded-full -rotate-45"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: "translate(-50%, -50%) rotate(-45deg)",
                opacity: ((index + 1) / trail.length) * 0.8,
                scale: (index + 1) / trail.length,
              }}
            />
          ))}

        {/* Spiral grid for spiral type */}
        {type === "spiral" && (
          <div className="absolute inset-0 -rotate-45 opacity-30">
            <div className="w-full h-full flex items-center justify-center">
              <div
                className="w-20 h-20 border-2 border-white/30 rounded-full animate-spin"
                style={{ animationDuration: "4s" }}
              />
              <div
                className="absolute w-12 h-12 border border-white/20 rounded-full animate-spin"
                style={{
                  animationDuration: "2s",
                  animationDirection: "reverse",
                }}
              />
            </div>
          </div>
        )}

        {/* Wave pattern for wave type */}
        {type === "wave" && (
          <div className="absolute inset-0 -rotate-45 opacity-25 overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
              style={{
                background:
                  "repeating-linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 10px, transparent 20px)",
                animation: "wave 2s ease-in-out infinite",
              }}
            />
          </div>
        )}
      </div>

      {/* Hover label */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap">
          {title}
        </div>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description, gradient }) {
  return (
    <div className="group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
      <div
        className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
