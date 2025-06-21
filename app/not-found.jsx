"use client"; // Needed for App Router

import { useEffect } from "react";
import { useRouter } from "next/navigation"; 

const NotFound = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 2000); 

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-purple-500">404</h1>
        <p className="text-lg mt-2">Page not found. Redirecting to home...</p>
      </div>
    </div>
  );
};

export default NotFound;
