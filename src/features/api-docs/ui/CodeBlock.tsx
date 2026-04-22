"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const LANG_LABELS: Record<string, string> = {
  javascript: "Node.js",
  python: "Python",
  bash: "cURL",
  json: "Response",
};

interface Tab {
  lang: "javascript" | "python" | "bash" | "json";
  code: string;
}

interface Props {
  tabs: Tab[];
}

export function CodeBlock({ tabs }: Props) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const current = tabs[active];

  function copy() {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="rounded-none border border-[#2A2A2A] overflow-hidden font-mono text-sm">
      {/* Tab bar */}
      <div className="flex items-center justify-between bg-[#1A1A1A] border-b border-[#2A2A2A] px-1">
        <div className="flex">
          {tabs.map((t, i) => (
            <button
              key={t.lang}
              onClick={() => setActive(i)}
              className={`px-4 py-2.5 text-xs font-medium transition-colors ${
                active === i
                  ? "text-white border-b-2 border-[var(--secondary)]"
                  : "text-[#6B7280] hover:text-[#9CA3AF] border-b-2 border-transparent"
              }`}
            >
              {LANG_LABELS[t.lang] ?? t.lang}
            </button>
          ))}
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#6B7280] hover:text-white transition-colors mr-1"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check size={12} className="text-[var(--success)]" />
              <span className="text-[var(--success)]">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code area */}
      <SyntaxHighlighter
        language={current.lang}
        style={atomOneDark}
        customStyle={{
          margin: 0,
          padding: "1.25rem 1.5rem",
          background: "#111111",
          fontSize: "0.8125rem",
          lineHeight: "1.6",
        }}
        showLineNumbers={current.code.split("\n").length > 4}
        lineNumberStyle={{ color: "#3A3A3A", marginRight: "1rem", userSelect: "none" }}
      >
        {current.code}
      </SyntaxHighlighter>
    </div>
  );
}
