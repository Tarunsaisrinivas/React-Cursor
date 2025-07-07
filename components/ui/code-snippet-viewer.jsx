"use client";
import { useState, useEffect } from "react";
import {
    Copy,
    Check,
    ChevronDown,
    ChevronUp,
    Maximize,
    Minimize,
} from "lucide-react";

export default function CodeSnippetViewer({
    code,
    language = "javascript",
    maxLines = 15,
    title,
}) {
    const [copied, setCopied] = useState(false);
    const [showFullSnippet, setShowFullSnippet] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const lines = code.split("\n");
    const displayLines =
        showFullSnippet || isExpanded ? lines : lines.slice(0, maxLines);
    const hasMoreLines = lines.length > maxLines;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy code:", err);
        }
    };

    // Auto-collapse when code changes
    useEffect(() => {
        setShowFullSnippet(false);
        setIsExpanded(false);
    }, [code]);

    return (
        <div
            className={`relative bg-gray-900/80 backdrop-blur-md rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl transition-all duration-300 ${
                isExpanded ? "fixed inset-4 z-50" : "max-w-full"
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header */}
            <div
                className={`flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-b border-gray-700/30 transition-opacity ${
                    isHovered ? "opacity-100" : "opacity-90"
                }`}
            >
                <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    {title && (
                        <span className="text-gray-300 text-sm font-medium ml-2">
                            {title}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1.5 rounded-md hover:bg-gray-700/50 transition-colors duration-200 text-gray-400 hover:text-gray-200"
                        title={isExpanded ? "Minimize" : "Expand"}
                        aria-label={
                            isExpanded
                                ? "Minimize code viewer"
                                : "Expand code viewer"
                        }
                    >
                        {isExpanded ? (
                            <Minimize className="w-4 h-4" />
                        ) : (
                            <Maximize className="w-4 h-4" />
                        )}
                    </button>
                    <button
                        onClick={copyToClipboard}
                        className={`p-1.5 rounded-md transition-all duration-200 flex items-center gap-1 text-xs font-medium ${
                            copied
                                ? "bg-green-900/30 text-green-400"
                                : "hover:bg-gray-700/50 text-gray-400 hover:text-gray-200"
                        }`}
                        title="Copy code"
                        aria-label="Copy code to clipboard"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4" />
                                <span>Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                <span>Copy</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Code Content */}
            <div className="relative">
                <div className="flex overflow-auto">
                    {/* Line Numbers */}
                    <div className="flex-shrink-0 px-4 py-4 bg-gray-900/20 border-r border-gray-700/30 select-none text-right sticky left-0">
                        {displayLines.map((_, index) => (
                            <div
                                key={index}
                                className="text-gray-500 text-sm font-mono leading-6"
                                style={{
                                    minWidth: `${
                                        String(displayLines.length).length + 1
                                    }ch`,
                                }}
                                aria-hidden="true"
                            >
                                {index + 1}
                            </div>
                        ))}
                    </div>

                    {/* Code Lines */}
                    <div className="flex-1 px-4 py-4 overflow-x-auto">
                        <pre className="text-sm font-mono whitespace-pre">
                            <code className="text-gray-100">
                                {displayLines.map((line, index) => (
                                    <div
                                        key={index}
                                        className="leading-6 hover:bg-gray-800/30 transition-colors duration-100 rounded px-1"
                                    >
                                        {line || <>&nbsp;</>}
                                    </div>
                                ))}
                            </code>
                        </pre>
                    </div>
                </div>

                {/* See Full Snippet Button */}
                {hasMoreLines && !showFullSnippet && !isExpanded && (
                    <>
                        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
                            <button
                                onClick={() => setShowFullSnippet(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium backdrop-blur-sm shadow-lg"
                            >
                                <span>
                                    Show more ({lines.length - maxLines} more
                                    lines)
                                </span>
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Gradient Overlay for truncated content */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900/90 to-transparent pointer-events-none" />
                    </>
                )}
            </div>

            {/* Collapse Button when expanded */}
            {(showFullSnippet || isExpanded) && hasMoreLines && (
                <div className="px-4 py-3 bg-gray-800/30 border-t border-gray-700/30 flex justify-center">
                    <button
                        onClick={() => {
                            setShowFullSnippet(false);
                            setIsExpanded(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors duration-200 hover:bg-gray-700/30 rounded-lg"
                    >
                        <span>Show less</span>
                        <ChevronUp className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Language badge */}
            <div className="absolute top-14 right-4 px-2 py-1 border-indigo-700 bg-gray-800/60 text-indigo-300 text-xs font-mono rounded-md backdrop-blur-sm">
                {language}
            </div>
        </div>
    );
}
