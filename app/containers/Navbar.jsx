"use client";
import { useEffect, useState } from "react";
import {
  Github,
  Search,
  Sun,
  Moon,
  Terminal,
  X,
  FileText,
  Settings,
  User,
  Home,
  TerminalIcon,
  Mouse,
} from "lucide-react";
import { Command } from "cmdk";
import Image from "next/image";
// import { ModeToggle } from "@/components/ui/ModeToggle";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Navbar() {
  const router = useRouter();
  // const [darkMode, setDarkMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // // Toggle dark mode class on <html>
  // useEffect(() => {
  //   document.documentElement.classList.toggle("dark", darkMode);
  // }, [darkMode]);

  // Keyboard shortcut Ctrl+K to toggle search popup
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Reset search value when popup closes
  useEffect(() => {
    if (!isSearchOpen) {
      setSearchValue("");
    }
  }, [isSearchOpen]);

  const handleCommand = (value) => {
    console.log("Selected command:", value);
    setIsSearchOpen(false);
    // Handle different commands here
    switch (value) {
      case "binary-cursor":
        router.push("/CursorAnimation/BinaryCursor");
        break;
      case "canvas-cursor":
        router.push("/CursorAnimation/CanvasCursor");
        break;
      case "aim-cursor":
        router.push("/CursorAnimation/AimCursor");
        break;
      case "neon-pulse-cursor":
        router.push("/CursorAnimation/NeonPulseCursor");
        break;
      case "lens-maginifier-cursor":
        router.push("/CursorAnimation/LensMagnifier");
        break;
      case "smooth-follow-cursor":
        router.push("/CursorAnimation/SmoothFollowCursor");
        break;
      case "fluid-simulation-cursor":
        router.push("/CursorAnimation/SmoothFollowCursor");
        break;
      case "github":
        window.open(
            "https://github.com/Tarunsaisrinivas/React-Cursor",
            "_blank"
        );
        break;
      // case "toggle-theme":
      //   setDarkMode((d) => !d);
      //   break;
      default:
        break;
    }
  };

  return (
      <>
          <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/60 dark:bg-gray-900/20 shadow-md border-b border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
                  {/* Left logo */}

                  <div className="flex items-center gap-2">
                      <Link href="/" className="flex items-center">
                          <Image
                              src="/logo.png"
                              alt="Logo"
                              width={50}
                              height={50}
                              className="hover:rotate-12 transition-transform duration-300 ease-in-out rounded-full"
                          />
                          <span className="font-bold text-lg">
                              React Cursor
                          </span>
                      </Link>
                  </div>

                  {/* Right controls */}
                  <div className="flex items-center gap-4">
                      {/* Search button with shortcut hint */}
                      <button
                          onClick={() => setIsSearchOpen(true)}
                          className="flex items-center gap-2 rounded-md px-3 py-1 text-sm bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 text-gray-800 dark:text-gray-100 hover:bg-white/30 dark:hover:bg-white/20 transition duration-200"
                          title="Open search (Ctrl + K)"
                      >
                          <Search className="w-5 h-5" />
                          <span>Search</span>
                          <kbd className="ml-2 rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs font-sans text-gray-600 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300">
                              Ctrl + K
                          </kbd>
                      </button>

                      {/* GitHub icon */}
                      <a
                          href="https://github.com/Tarunsaisrinivas/React-Cursor"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full backdrop-blur-md hover:bg-gray-200/40 dark:hover:bg-white/10 transition"
                          title="GitHub"
                      >
                          <Github className="w-5 h-5" />
                      </a>

                      {/* Theme toggle */}
                      {/* <ModeToggle /> */}
                      {/* <button
              onClick={() => setDarkMode((d) => !d)}
              className="p-2 rounded-full backdrop-blur-md hover:bg-gray-200/40 dark:hover:bg-white/10 transition"
              title="Toggle theme"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )} 
             </button> */}
                  </div>
              </div>
          </header>

          {/* Command palette popup */}
          {isSearchOpen && (
              <div
                  onClick={() => setIsSearchOpen(false)}
                  className="fixed inset-0 z-60 bg-black bg-opacity-40 backdrop-blur-sm flex items-start justify-center p-4 pt-[10vh]"
              >
                  <div
                      onClick={(e) => e.stopPropagation()}
                      className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                      <Command
                          className="w-full"
                          value={searchValue}
                          onValueChange={setSearchValue}
                      >
                          <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-3">
                              <Search className="w-4 h-4 text-gray-400 mr-2" />
                              <Command.Input
                                  placeholder="Type a command or search..."
                                  className="flex-1 bg-transparent border-0 outline-none py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                              />
                              <button
                                  onClick={() => setIsSearchOpen(false)}
                                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition ml-2"
                                  aria-label="Close search"
                              >
                                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              </button>
                          </div>

                          <Command.List className="max-h-80 overflow-y-auto p-2">
                              <Command.Empty className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                  No results found.
                              </Command.Empty>

                              <Command.Group heading="Navigation">
                                  <Command.Item
                                      value="binary-cursor"
                                      onSelect={handleCommand}
                                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-gray-800"
                                  >
                                      <Mouse className="w-4 h-4" />
                                          <span>Binary Cursor</span>
                                      
                                  </Command.Item>
                                  <Command.Item
                                      value="canvas-cursor"
                                      onSelect={handleCommand}
                                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-gray-800"
                                  >
                                      <Mouse className="w-4 h-4" />
                                      <span>Canvas Cursor</span>
                                  </Command.Item>
                                  <Command.Item
                                      value="aim-cursor"
                                      onSelect={handleCommand}
                                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-gray-800"
                                  >
                                      <Mouse className="w-4 h-4" />
                                      <span>Aim Cursor</span>
                                  </Command.Item>
                                  <Command.Item
                                      value="neon-pulse-cursor"
                                      onSelect={handleCommand}
                                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-gray-800"
                                  >
                                      <Mouse className="w-4 h-4" />
                                      <span>Neon Pulse Cursor</span>
                                  </Command.Item>
                                  <Command.Item
                                      value="lens-maginifier-cursor"
                                      onSelect={handleCommand}
                                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-gray-800"
                                  >
                                      <Mouse className="w-4 h-4" />
                                      <span>Lens Magnifier Cursor</span>
                                  </Command.Item>
                                  <Command.Item
                                      value="smooth-follow-cursor"
                                      onSelect={handleCommand}
                                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-gray-800"
                                  >
                                      <Mouse className="w-4 h-4" />
                                      <span>Smooth Follow Cursor</span>
                                  </Command.Item>
                                  <Command.Item
                                      value="fluid-simulation-cursor"
                                      onSelect={handleCommand}
                                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-gray-800"
                                  >
                                      <Mouse className="w-4 h-4" />
                                      <span>Fluid Simulation Cursor</span>
                                  </Command.Item>
                                 
                              </Command.Group>

                              <Command.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

                              <Command.Group heading="Resources">
                                  <Command.Item
                                      value="docs"
                                      onSelect={handleCommand}
                                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-gray-800"
                                  >
                                      <FileText className="w-4 h-4" />
                                      <span>Introduction</span>
                                  </Command.Item>
                                  <Command.Item
                                      value="github"
                                      onSelect={handleCommand}
                                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-gray-800"
                                  >
                                      <Link
                                          className="flex items-center gap-2"
                                          href="https://github.com/Tarunsaisrinivas/React-Cursor"
                                      >
                                          <Github className="w-4 h-4" />
                                          <span>View on GitHub</span>
                                      </Link>
                                  </Command.Item>
                              </Command.Group>

                              <Command.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

                              {/* <Command.Group heading="Actions">
                                  <Command.Item
                                      value="toggle-theme"
                                      onSelect={handleCommand}
                                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-gray-800"
                                  ></Command.Item>
                              </Command.Group> */}
                          </Command.List>
                      </Command>
                  </div>
              </div>
          )}
      </>
  );
}
