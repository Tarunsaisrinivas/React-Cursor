"use client"; // Needed for App Router

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const NotFound = () => {
    const router = useRouter();

    useEffect(() => {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);
      return () => clearTimeout(timer);
    }, [router]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-black text-white px-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10 animate-fade-in">
                <div className="text-center md:text-left">
                    <h1 className="text-6xl font-extrabold text-purple-500 mb-4">
                        404
                    </h1>
                    <p className="text-lg md:text-xl">Page not found.</p>
                    <p className="text-sm opacity-70 mt-1">
                        Redirecting you to the home page...
                    </p>
                </div>

                <div className="w-40 md:w-80">
                    <Image
                        src="/person.svg"
                        width={300}
                        height={300}
                        alt="404 image"
                        className="brightness-0 invert"
                        priority
                    />
                </div>
            </div>
        </main>
    );
};

export default NotFound;
