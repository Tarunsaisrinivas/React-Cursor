"use client";
import { useState } from "react";
import { Copy, Check, ChevronUp } from "lucide-react";

export default function CodeSnippetViewer({
  code,
  language = "javascript",
  maxLines = 20,
  title,
}) {
  const [copied, setCopied] = useState(false);
  const [showFullSnippet, setShowFullSnippet] = useState(false);

  const lines = code.split("\n");
  const displayLines = showFullSnippet ? lines : lines.slice(0, maxLines);
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

  return (
    <div className="relative bg-[#0d1117] rounded-lg border border-white/30 overflow-hidden shadow-2xl">
      {/* Header */}
      {title && (
        <div className="px-4 py-2 bg-[#0d1117] border-b border-gray-700">
          <span className="text-gray-300 text-sm font-medium">{title}</span>
        </div>
      )}

      {/* Copy Button */}
      <button
        tabIndex={0}
        onClick={copyToClipboard}
        className="absolute top-4 right-4 z-10 p-2 bg-gray-800 hover:bg-gray-700 rounded-md border border-gray-600 transition-all duration-200 group"
        title="Copy code"
        aria-label="Copy code to clipboard"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-gray-400 group-hover:text-white" />
        )}
      </button>

      {/* Code Content */}
      <div className="relative">
        <div className="flex">
          {/* Line Numbers */}
          <div className="flex-shrink-0 px-4 py-4 bg-[#0d1117] border-r border-gray-700 select-none text-right">
            {displayLines.map((_, index) => (
              <div
                key={index}
                className="text-gray-500 text-sm font-mono leading-6"
                style={{ minWidth: "2ch" }}
              >
                {index + 1}
              </div>
            ))}
          </div>

          {/* Code Lines */}
          <div className="flex-1 px-4 py-4 overflow-x-auto">
            <pre className="text-sm font-mono whitespace-pre">
              <code className="text-gray-300">
                {displayLines.map((line, index) => (
                  <div key={index} className="leading-6">
                    {line || <>&nbsp;</>}
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>

        {/* See Full Snippet Button */}
        {hasMoreLines && !showFullSnippet && (
          <>
            <div className="absolute bottom-0 right-0 p-4">
              <button
                onClick={() => setShowFullSnippet(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md border border-gray-600 text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium"
              >
                <span>See Full Snippet</span>
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>

            {/* Gradient Overlay for truncated content */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
          </>
        )}
      </div>

      {/* Collapse Button when expanded */}
      {showFullSnippet && hasMoreLines && (
        <div className="px-4 py-3 bg-gray-800/50 border-t border-gray-700">
          <button
            onClick={() => setShowFullSnippet(false)}
            className="flex items-center gap-2 px-3 py-1 text-gray-400 hover:text-white text-sm transition-colors duration-200"
          >
            <span>Collapse</span>
            <ChevronUp className="w-4 h-4 rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
}
