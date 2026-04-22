"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

interface Stat {
  label: string;
  value: number | string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
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
    const controls = animate(motionVal, value, { duration: 1.2, ease: "easeOut" });
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

export function HeroStats({ totalOffers, salaryPct, remotePct, topCountry, topCountryJobs }: HeroStatsProps) {
  const stats: Stat[] = [
    { label: "Total Job Offers", value: "+5000" },
    { label: "With Salary Data", value: salaryPct, suffix: "%" },
    { label: "Remote Positions", value: remotePct, suffix: "%" },
    { label: "Jobs in Top Country", value: topCountryJobs },
  ];

  return (
    <section id="overview" className="py-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <p className="text-xs font-mono text-[var(--secondary)] mb-3 uppercase tracking-widest">
          Market Intelligence · LATAM and Spain Tech
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-[var(--primary)] leading-tight mb-4">
          Tech Jobs<br />Trend Report
        </h1>
        <p className="text-[var(--text-muted)] max-w-lg text-base">
          Aggregated data from +{Math.round(totalOffers / 1000) * 1000} job postings across LATAM and Spain in the last 12 months.<br />
          Skills, salaries, roles, and market distribution — all in one place.
        </p>
   
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border)]">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * i }}
            className="bg-[var(--surface)] px-6 py-8"
          >
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
                <span className="block text-[var(--secondary)] font-semibold">{topCountry}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
