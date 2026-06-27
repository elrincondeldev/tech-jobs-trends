"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GitHubStarButton } from "./GitHubStarButton";

const links = [
  { href: "/#overview", label: "Overview" },
  { href: "/#skills", label: "Skills" },
  { href: "/#roles", label: "Roles" },
  { href: "/#salary", label: "Salary" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="relative group text-sm font-medium text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors duration-200"
    >
      {label}
      <motion.span
        className="absolute -bottom-0.5 left-0 h-px bg-[var(--secondary)] block"
        initial={{ width: 0 }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </Link>
  );
}

export function NavBar() {
  const { scrollY } = useScroll();
  const borderOpacity = useTransform(scrollY, [0, 40], [0, 1]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 10));
    return unsub;
  }, [scrollY]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--surface)]/90 backdrop-blur-md shadow-sm"
          : "bg-[var(--surface)]"
      }`}
      style={{
        borderBottom: "1px solid",
        borderColor: `rgba(229,231,235,${scrolled ? 1 : 0.6})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <motion.span
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.15 }}
            className="font-display font-bold text-sm tracking-wide text-[var(--primary)]"
          >
            Tech Jobs
            <span className="text-[var(--secondary)]"> Trends</span>
          </motion.span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <NavLink key={l.href} href={l.href} label={l.label} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <GitHubStarButton />
          <Link
            href="/api-docs"
            className="text-xs font-medium px-3 py-1.5 bg-[var(--primary)] text-white hover:bg-[var(--secondary)] transition-colors duration-200"
          >
            API Docs
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
