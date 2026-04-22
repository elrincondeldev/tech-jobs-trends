"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const endpoints = [
  {
    method: "GET",
    path: "/api/overview",
    description: "Report metadata and overview statistics.",
    params: [],
  },
  {
    method: "GET",
    path: "/api/roles",
    description: "All roles with job counts and percentages.",
    params: [{ name: "limit", desc: "Max results (default: 20)" }],
  },
  {
    method: "GET",
    path: "/api/skills",
    description: "Top skills overall or filtered by role.",
    params: [
      { name: "role", desc: "Role name (e.g. backend, devops, frontend)" },
      { name: "limit", desc: "Max results (default: 20)" },
    ],
  },
  {
    method: "GET",
    path: "/api/distribution",
    description: "Job distribution by various dimensions.",
    params: [
      { name: "type", desc: "level | work_mode | country | platform | category | contract" },
    ],
  },
  {
    method: "GET",
    path: "/api/salary",
    description: "Salary statistics globally and by breakdown.",
    params: [
      { name: "by", desc: "level | country | work_mode | role" },
    ],
  },
  {
    method: "POST",
    path: "/api/seed",
    description: "Seed or refresh the database from the source report.",
    params: [],
  },
];

const METHOD_COLORS: Record<string, string> = {
  GET: "#16A34A",
  POST: "#2563EB",
};

export function ApiDocsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="api" className="py-16 px-6 max-w-7xl mx-auto">
      <p className="text-xs font-mono text-[var(--secondary)] uppercase tracking-widest mb-2">
        Public API
      </p>
      <h2 className="font-display text-3xl font-bold text-[var(--primary)] mb-2">
        REST API Reference
      </h2>
      <p className="text-[var(--text-muted)] text-sm mb-10">
        All endpoints return JSON. No auth required. Base URL: <code className="font-mono text-[var(--secondary)] text-xs">https://yourdomain.com</code>
      </p>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="border border-[var(--border)] divide-y divide-[var(--border)]"
      >
        {endpoints.map((ep, i) => (
          <motion.div
            key={ep.path}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.05 * i }}
            className="p-6"
          >
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span
                className="font-mono text-xs font-bold px-2 py-0.5"
                style={{ color: METHOD_COLORS[ep.method], backgroundColor: `${METHOD_COLORS[ep.method]}15` }}
              >
                {ep.method}
              </span>
              <code className="font-mono text-sm text-[var(--primary)]">{ep.path}</code>
            </div>
            <p className="text-sm text-[var(--text-muted)] mb-3">{ep.description}</p>
            {ep.params.length > 0 && (
              <div className="space-y-1.5">
                {ep.params.map((p) => (
                  <div key={p.name} className="flex gap-3 text-xs">
                    <code className="font-mono text-[var(--secondary)] w-24 shrink-0">{p.name}</code>
                    <span className="text-[var(--text-muted)]">{p.desc}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
