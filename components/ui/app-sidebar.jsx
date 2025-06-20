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

const items = [
  { title: "Binary Cursor", url: "/dashboard/BinaryCursor" },
  { title: "Canvas Cursor", url: "/dashboard/CanvasCursor" },
  { title: "Neon Pulse Cursor", url: "/neon" },
  { title: "Particle Cursor", url: "/particle" },
  { title: "Comet Cursor", url: "/comet" },
  { title: "Magnetic Cursor", url: "/magnetic" },
  { title: "Bubble Cursor", url: "/bubble" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" className="absolute top-13">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Cursor Animations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all
                          ${
                            isActive
                              ? "border-l-4 border-white text-white bg-transparent"
                              : "hover:border-l-4 hover:border-white hover:text-white"
                          }`}
                      >
                        <span>{item.title}</span>
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
