"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Heart, Star } from "lucide-react";
import AimCursor from "./dashboard/AimCursor/component";
import Navbar from "./containers/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BorderBeam } from "@/components/magicui/border-beam";
import Loading from "./containers/Loading";
import { useState } from "react";
import Footer from "./containers/Footer";

export default function LandingPage() {
  const [loading, setLoading] = useState(false);
  const handleNavigation = (href) => {
    setLoading(true);
    router.push(href);
  };
  const router = useRouter();
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Grid Pattern Background */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fillRule='evenodd'%3e%3cg fill='%23ffffff' fillOpacity='1'%3e%3ccircle cx='30' cy='30' r='1.5'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
          }}
        />

        <div className="relative z-10">
          {/* Header */}

          {/* Hero Section */}
          <main className="max-w-7xl mx-auto px-6 pt-20 pb-12">
            <div className="text-center space-y-8 mb-16">
              <h1 className="text-6xl md:text-8xl font-bold leading-tight">
                Create Magical
                <br />
                <span className="text-gray-400">Canvas Cursors</span>
              </h1>

              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Create bespoke cursor trails in React effortlessly—Canvas Cursor
                delivers high performance and deep customization.
              </p>

              <Button
                onClick={() => handleNavigation("/dashboard/BinaryCursor")}
                size="lg"
                className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-lg font-medium rounded-lg group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Canvas Cursor Demo */}
            <div className="max-w-5xl md:w-2/3 mx-auto ">
              <div className=" bg-black/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
                {/* Browser Chrome */}
                <div className="flex items-center space-x-2 px-6 py-4 border-b border-gray-800">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <div className="flex-1 text-center">
                    <div className="bg-white/20  backdrop-blur-lg rounded-md px-4 py-1 text-sm text-white inline-block shadow-md">
                      cursory.vercel.app
                    </div>
                  </div>
                </div>

                {/* Canvas Demo */}
                <div className="p-6 ">
                  <AimCursor className="bg-black " />
                  <BorderBeam duration={8} size={100} />
                </div>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-4 mt-12">
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full px-6 py-3">
                  <span className="text-sm text-gray-300">
                    ⚡ 60fps Performance
                  </span>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full px-6 py-3">
                  <span className="text-sm text-gray-300">
                    🎯 Pixel Perfect
                  </span>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full px-6 py-3">
                  <span className="text-sm text-gray-300">
                    🎨 Fully Customizable
                  </span>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full px-6 py-3">
                  <span className="text-sm text-gray-300">
                    📦 Zero Dependencies
                  </span>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full px-6 py-3">
                  <span className="text-sm text-gray-300">
                    🔷 TypeScript Ready
                  </span>
                </div>
              </div>
            </div>
          </main>

          {/* Installation Section */}
          <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold">
                Get Started in
                <span className="text-gray-400"> Seconds</span>
              </h2>

              <div className="max-w-2xl mx-auto">
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
                  <div className="space-y-6">
                    <div className="text-left">
                      <div className="text-sm text-gray-400 mb-2">
                        Install the package
                      </div>
                      <div className="bg-black rounded-lg p-4 font-mono text-sm">
                        <span className="text-gray-500">$</span>{" "}
                        <span className="text-green-400">npm install</span>{" "}
                        <span className="text-blue-400">binary-cursor</span>
                      </div>
                    </div>

                    <div className="text-left">
                      <div className="text-sm text-gray-400 mb-2">
                        Import and use
                      </div>
                      <div className="bg-black rounded-lg p-4 font-mono text-sm space-y-1">
                        <div>
                          <span className="text-purple-400">import</span>{" "}
                          <span className="text-yellow-400">
                            {"{ BinaryCursor }"}
                          </span>{" "}
                          <span className="text-purple-400">from</span>{" "}
                          <span className="text-green-400">
                            &apos;binary-cursor&apos;
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className="text-blue-400">
                            {"<BinaryCursor"}
                          </span>
                        </div>
                        <div className="ml-4">
                          <span className="text-yellow-400">color</span>
                          <span className="text-white">=</span>
                          <span className="text-green-400">{'"#12E193"'}</span>
                        </div>
                        <div className="ml-4">
                          <span className="text-yellow-400">size</span>
                          <span className="text-white">=</span>
                          <span className="text-green-400">{"{18}"}</span>
                        </div>
                        <div className="ml-4">
                          <span className="text-yellow-400">count</span>
                          <span className="text-white">=</span>
                          <span className="text-green-400">{"{4}"}</span>
                        </div>
                        <div className="ml-4">
                          <span className="text-yellow-400">spread</span>
                          <span className="text-white">=</span>
                          <span className="text-green-400">{"{2.5}"}</span>
                        </div>
                        <div className="ml-4">
                          <span className="text-yellow-400">duration</span>
                          <span className="text-white">=</span>
                          <span className="text-green-400">{"{2000}"}</span>
                        </div>
                        <div className="ml-4">
                          <span className="text-yellow-400">frequency</span>
                          <span className="text-white">=</span>
                          <span className="text-green-400">{"{40}"}</span>
                        </div>
                        <div className="ml-4">
                          <span className="text-yellow-400">movementThreshold</span>
                          <span className="text-white">=</span>
                          <span className="text-green-400">{"{10}"}</span>
                        </div>
                        <div>
                          <span className="text-blue-400">{"/>"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="pb-12">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
