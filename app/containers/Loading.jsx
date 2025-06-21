"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-gray-900 border-b md:border-r md:border-b-0 border-gray-800 p-4 md:p-6">
        {/* Sidebar Header */}
        <div className="mb-6">
          <Skeleton className="h-6 w-32 bg-[#0d1117]" />
        </div>

        {/* Navigation Items */}
        <div className="space-y-3">
          {/* Active/Selected Item */}
          <div className="bg-[#0d1117] rounded-lg p-3 border border-gray-700">
            <Skeleton className="h-4 w-24 bg-gray-700" />
          </div>

          {/* Other Navigation Items */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="p-3">
              <Skeleton className="h-4 w-28 bg-[#0d1117]" />
            </div>
          ))}
        </div>

        {/* Bottom Navigation Icon */}
        <div className="hidden md:block absolute bottom-6 left-6">
          <Skeleton className="h-8 w-8 rounded-full bg-[#0d1117]" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Skeleton className="h-8 w-8 bg-[#0d1117]" />
            <Skeleton className="h-8 w-40 sm:w-64 bg-[#0d1117]" />
            <Skeleton className="h-6 w-16 sm:w-20 bg-[#0d1117] rounded-full" />
          </div>
          <Skeleton className="h-5 w-60 sm:w-96 bg-[#0d1117]" />
        </div>

        {/* Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg w-fit">
            <div className="bg-[#0d1117] px-4 py-2 rounded-md">
              <Skeleton className="h-4 w-16 bg-gray-700" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-4 py-2">
                <Skeleton className="h-4 w-16 bg-[#0d1117]" />
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="space-y-2">
              <Skeleton className="h-6 w-32 bg-[#0d1117]" />
              <Skeleton className="h-4 w-64 sm:w-80 bg-[#0d1117]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="min-h-[250px] sm:min-h-[300px] bg-[#0d1117]/30 rounded-lg border-2 border-dashed border-gray-700 flex items-center justify-center relative overflow-hidden">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-pulse"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${2 + Math.random() * 2}s`,
                    }}
                  >
                    <Skeleton className="h-3 w-3 bg-emerald-500/20" />
                  </div>
                ))}
              </div>

              {/* Center Content */}
              <div className="text-center space-y-4 z-10">
                <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg bg-gray-700 mx-auto" />
                <Skeleton className="h-6 w-32 sm:w-48 bg-gray-700 mx-auto" />
                <Skeleton className="h-4 w-40 sm:w-64 bg-[#0d1117] mx-auto" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Floating Binary Digits Animation */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-emerald-400 font-mono text-sm animate-pulse opacity-30"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {/* Binary */}
              {/* {Math.random() > 0.5 ? "1" : "0"} */}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
