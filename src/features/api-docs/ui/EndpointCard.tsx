"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CodeBlock } from "./CodeBlock";

const METHOD_STYLES: Record<string, { text: string; bg: string }> = {
  GET:  { text: "#16A34A", bg: "#16A34A18" },
  POST: { text: "#2563EB", bg: "#2563EB18" },
};

export interface Param {
  name: string;
  type: string;
  required?: boolean;
  desc: string;
}

export interface CodeExample {
  lang: "javascript" | "python" | "bash" | "json";
  code: string;
}

export interface EndpointDef {
  method: "GET" | "POST";
  path: string;
  description: string;
  params?: Param[];
  examples: CodeExample[];
  response: string;
}

interface Props {
  endpoint: EndpointDef;
  defaultOpen?: boolean;
}

export function EndpointCard({ endpoint: ep, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const style = METHOD_STYLES[ep.method];

  const tabs: CodeExample[] = [
    ...ep.examples,
    { lang: "json", code: ep.response },
  ];

  return (
    <div className="border border-[var(--border)] overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-[#FAFAFA] transition-colors"
      >
        <span
          className="font-mono text-xs font-bold px-2 py-0.5 shrink-0"
          style={{ color: style.text, backgroundColor: style.bg }}
        >
          {ep.method}
        </span>
        <code className="font-mono text-sm text-[var(--primary)] flex-1">{ep.path}</code>
        <span className="text-xs text-[var(--text-muted)] hidden md:block pr-4">{ep.description}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-[var(--text-muted)]"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--border)] px-6 py-6 space-y-6">
              <p className="text-sm text-[var(--text-muted)]">{ep.description}</p>

              {ep.params && ep.params.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[var(--primary)] uppercase tracking-widest mb-3">
                    Query Parameters
                  </h4>
                  <div className="border border-[var(--border)] divide-y divide-[var(--border)]">
                    <div className="grid grid-cols-12 px-4 py-2 bg-[#FAFAFA] text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                      <span className="col-span-3">Name</span>
                      <span className="col-span-2">Type</span>
                      <span className="col-span-2">Required</span>
                      <span className="col-span-5">Description</span>
                    </div>
                    {ep.params.map((p) => (
                      <div key={p.name} className="grid grid-cols-12 px-4 py-3 text-xs items-center">
                        <code className="col-span-3 font-mono text-[var(--secondary)]">{p.name}</code>
                        <span className="col-span-2 font-mono text-[var(--text-muted)]">{p.type}</span>
                        <span className="col-span-2">
                          {p.required ? (
                            <span className="text-[var(--danger)]">required</span>
                          ) : (
                            <span className="text-[var(--text-muted)]">optional</span>
                          )}
                        </span>
                        <span className="col-span-5 text-[var(--text-muted)]">{p.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-semibold text-[var(--primary)] uppercase tracking-widest mb-3">
                  Code Examples
                </h4>
                <CodeBlock tabs={tabs} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
