"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import Navbar from "../containers/Navbar";
import Header from "../containers/Header";
import Footer from "../containers/Footer";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import CursorLoading from "../containers/CursorLoading";

export default function Layout({ children }) {
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 500); // Customize this delay (ms)
        return () => clearTimeout(timeout);
    }, [pathname]); // Run on route change

    return (
        <div>
            <Navbar />

            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-hidden transition-all duration-200 ease-in-out">
                        {loading ? (
                            <div className="flex items-center justify-center min-h-[300px]">
                                <CursorLoading />
                            </div>
                        ) : (
                            children
                        )}
                    </main>
                    <Footer />
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
