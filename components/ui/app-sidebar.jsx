"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Suspense } from "react";
import Loading from "@/app/containers/Loading";

const items = [
    { title: "Binary Cursor", url: "/CursorAnimation/BinaryCursor" },
    { title: "Canvas Cursor", url: "/CursorAnimation/CanvasCursor" },
    { title: "Aim Cursor", url: "/CursorAnimation/AimCursor" },
    { title: "Neon Pulse Cursor", url: "/CursorAnimation/NeonPulseCursor" },
    {
        title: "Lens Magnifier Cursor",
        url: "/CursorAnimation/LensMagnifier",
    },

    {
        title: "Smooth Follow Cursor",
        url: "/CursorAnimation/SmoothFollowCursor",
        isNew: true,
    },
      { title: "Fluid Simulation Cursor", url: "/CursorAnimation/FluidSimulation" ,isNew: true},
    //   { title: "Magnetic Cursor", url: "/magnetic" },
    //   { title: "Bubble Cursor", url: "/bubble" },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        // <div className="sticky top-[3.25rem] z-10 h-[calc(100vh-3.25rem)]">
        <Sidebar variant="sidebar" className="h-full top-14 ">
            <SidebarContent className="bg-[#171717]">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-lg text-purple-400">
                        Cursor Animations
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = pathname === item.url;

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                href={item.url}
                                                className={`flex items-center justify-between px-2 py-1 rounded-md transition-all duration-200
                                                    ${
                                                        isActive
                                                            ? "border-l-4 border-purple-800 text-purple-400 bg-[#171717] backdrop-blur-sm"
                                                            : "hover:border-l-4 hover:border-white hover:bg-white/20 hover:backdrop-blur-xl hover:text-white"
                                                    }`}
                                            >
                                                <span>{item.title}</span>
                                                {item.isNew && (
                                                    <span className="ml-2 px-2 py-0.5 text-xs font-bold text-purple-200 bg-purple-400/10 border border-purple-300/30 rounded-full backdrop-blur-md shadow-inner shadow-purple-500/20">
                                                        New
                                                    </span>
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
