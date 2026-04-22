"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const links = [
  { href: "/#overview", label: "Overview" },
  { href: "/#skills", label: "Skills" },
  { href: "/#roles", label: "Roles" },
  { href: "/#salary", label: "Salary" },
];

export function NavBar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--border)]"
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="font-display font-semibold text-sm tracking-wide text-[var(--primary)]">
          Tech Jobs Trends
        </span>
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/api-docs"
          className="text-xs font-medium px-3 py-1.5 border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors"
        >
          API Docs
        </Link>
      </div>
    </motion.header>
  );
}
