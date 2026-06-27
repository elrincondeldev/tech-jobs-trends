"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

interface Stat {
  label: string;
  value: number | string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  accent?: string;
}

function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (v) =>
    `${prefix}${v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`
  );
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionVal, value, { duration: 1.4, ease: "easeOut" });
    return controls.stop;
  }, [inView, motionVal, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

interface HeroStatsProps {
  totalOffers: number;
  salaryPct: number;
  remotePct: number;
  topCountry: string;
  topCountryJobs: number;
}

const CARD_ACCENTS = ["#8B5CF6", "#16A34A", "#2563EB", "#D97706"];

export function HeroStats({ totalOffers, salaryPct, remotePct, topCountry, topCountryJobs }: HeroStatsProps) {
  const stats: Stat[] = [
    { label: "Total Job Offers", value: "+5000", accent: CARD_ACCENTS[0] },
    { label: "With Salary Data", value: salaryPct, suffix: "%", accent: CARD_ACCENTS[1] },
    { label: "Remote Positions", value: remotePct, suffix: "%", accent: CARD_ACCENTS[2] },
    { label: "Jobs in Top Country", value: topCountryJobs, accent: CARD_ACCENTS[3] },
  ];

  return (
    <section id="overview" className="relative py-20 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Dot grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle, #111111 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 relative"
      >
        <motion.p
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xs font-mono text-[var(--secondary)] mb-3 uppercase tracking-widest"
        >
          Market Intelligence · LATAM and Spain Tech
        </motion.p>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-[var(--primary)] leading-tight mb-4">
          Tech Jobs<br />
          <span className="text-[var(--secondary)]">Trend</span> Report
        </h1>
        <p className="text-[var(--text-muted)] max-w-lg text-base leading-relaxed">
          Aggregated data from +{Math.round(totalOffers / 1000) * 1000} job postings across LATAM and Spain in the last 12 months.
          Skills, salaries, roles, and market distribution — all in one place.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--secondary)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--secondary)]" />
          </span>
          <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
            Live dataset · Updated {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 * i }}
            whileHover={{ y: -4, transition: { duration: 0.18 } }}
            className="relative bg-[var(--surface)] border border-[var(--border)] px-6 py-8 overflow-hidden group cursor-default"
          >
            <span
              className="absolute top-0 left-0 right-0 h-0.5 transition-all duration-300 group-hover:h-1"
              style={{ backgroundColor: stat.accent }}
            />
            <div className="text-3xl md:text-4xl font-display font-bold text-[var(--primary)] mb-2">
              {typeof stat.value === "string" ? (
                <span>{stat.value}</span>
              ) : (
                <AnimatedNumber
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              )}
            </div>
            <div className="text-xs text-[var(--text-muted)] font-medium">
              {stat.label}
              {stat.label === "Jobs in Top Country" && (
                <span className="block font-semibold mt-0.5" style={{ color: stat.accent }}>{topCountry}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="flex justify-center mt-14"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1.5 text-[var(--text-muted)]"
        >
          <span className="text-xs font-mono uppercase tracking-widest opacity-50">Scroll</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
