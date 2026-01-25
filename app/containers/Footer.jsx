import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
    return (
        <footer className="border-t border-gray-800 py-12 pb-0 ">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={50}
                            height={50}
                            className="hover:rotate-12 transition-transform duration-300 ease-in-out rounded-full"
                        />
                        <span className="font-bold text-lg">React Cursor</span>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                        {/* <a href="#" className="hover:text-white transition-colors">
              Documentation
            </a> */}
                        <Link
                            href="/CursorAnimation/BinaryCursor"
                            target="_blank"
                            className="hover:text-white transition-colors"
                        >
                            Examples
                        </Link>
                        <Link
                            href="https://github.com/Tarunsaisrinivas/React-Cursor"
                            target="_blank"
                            className="hover:text-white transition-colors"
                        >
                            GitHub
                        </Link>
                        <Link
                            href="https://www.npmjs.com/~tarun-sai-srinivas"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors"
                        >
                            NPM
                        </Link>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                    Built with 💜 by{" "}
                    <Link
                        href="https://tarunsaisrinivas.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-500"
                    >
                        Tarun Sai Srinivas
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
