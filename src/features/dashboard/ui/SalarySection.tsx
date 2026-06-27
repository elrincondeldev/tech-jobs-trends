"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList,
} from "recharts";
import type { SalaryByRole, SalaryStats } from "@/entities/report/model/types";
import { UnknownNote } from "@/shared/ui/UnknownNote";
import { InfoTooltip } from "@/shared/ui/InfoTooltip";
import { useIsMobile } from "@/shared/lib/useIsMobile";

interface Props {
  global: SalaryStats;
  byRole: SalaryByRole[];
  totalOffers: number;
  withSalary: number;
}

function fmt(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
}

function AnimatedSalary({ value }: { value: number }) {
  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (v) => fmt(Math.round(v)));
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionVal, value, { duration: 1.2, ease: "easeOut" });
    return controls.stop;
  }, [inView, motionVal, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

export function SalarySection({ global: globalStats, byRole, totalOffers, withSalary }: Props) {
  const withoutSalary = totalOffers - withSalary;
  const withoutPct = Math.round((withoutSalary / totalOffers) * 100 * 10) / 10;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isMobile = useIsMobile();

  const chartMargin = isMobile
    ? { top: 0, right: 45, left: 0, bottom: 0 }
    : { top: 0, right: 80, left: 130, bottom: 0 };
  const yAxisWidth = isMobile ? 90 : 126;

  const data = byRole
    .filter((r) => r.n >= 10)
    .sort((a, b) => b.median - a.median)
    .slice(0, 15)
    .map((r) => ({ name: r.role, median: r.median, mean: r.mean, n: r.n }));

  const salaryStats = [
    {
      label: "Global Median",
      value: globalStats.median,
      info: "The middle salary when all offers are sorted. Half of offers pay more than this, half pay less. More robust than the mean against extreme values.",
    },
    {
      label: "Global Mean",
      value: globalStats.mean,
      info: "The arithmetic average of all salaries. Can be pulled upward by a small number of very high-paying offers, so it's often higher than the median.",
    },
    {
      label: "25th Percentile",
      value: globalStats.p25,
      info: "Also called P25 or Q1. 25% of offers in the dataset pay less than this amount. A useful lower-bound reference for entry-level or lower-paying roles.",
    },
    {
      label: "75th Percentile",
      value: globalStats.p75,
      info: "Also called P75 or Q3. 75% of offers pay less than this amount — only the top 25% pay more. A useful upper-bound for senior or specialized positions.",
    },
  ];

  return (
    <section id="salary" className="py-16 px-6 max-w-7xl mx-auto">
      <p className="text-xs font-mono text-[var(--secondary)] uppercase tracking-widest mb-2">
        Compensation
      </p>
      <h2 className="font-display text-3xl font-bold text-[var(--primary)] mb-2">
        Salary Insights
      </h2>
      <p className="text-[var(--text-muted)] text-sm">
        Yearly USD. Entries above $500k excluded. Based on {globalStats.n.toLocaleString()} offers with salary data.
      </p>
      <UnknownNote
        count={withoutSalary}
        pct={withoutPct}
        label="didn't include salary information and are excluded from these charts"
      />

      <div className="mt-6 flex items-start gap-3 border border-[#FDE68A] bg-[#FFFBEB] px-5 py-4">
        <svg className="mt-0.5 shrink-0 text-[#D97706]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <div>
          <p className="text-xs font-semibold text-[#92400E] mb-1">Why do some salaries look high?</p>
          <p className="text-xs text-[#92400E] leading-relaxed">
            This dataset aggregates job postings from the Spanish-speaking market — primarily LATAM and Spain —
            but many companies operate out of the US or other high-income markets and publish remote-friendly positions open to the region.
            Those roles carry US-range salaries, which pull the mean and upper percentiles significantly upward.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 mb-12">
        {salaryStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 * i }}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            className="bg-[var(--surface)] border border-[var(--border)] px-6 py-6 cursor-default"
          >
            <div className="text-2xl font-display font-bold text-[var(--warning)] mb-2">
              <AnimatedSalary value={s.value} />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              {s.label}
              <InfoTooltip text={s.info} />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="border border-[var(--border)] p-6"
      >
        <h3 className="font-display font-semibold text-base text-[var(--primary)] mb-6">
          Median Salary by Role (USD/year)
        </h3>
        <ResponsiveContainer width="100%" height={460}>
          <BarChart
            data={data}
            layout="vertical"
            margin={chartMargin}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={fmt}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: isMobile ? 10 : 11, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
              width={yAxisWidth}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-[var(--primary)] text-white px-3 py-2 text-xs font-mono shadow-lg">
                    <p className="font-bold capitalize mb-1">{d.name}</p>
                    <p>Median: {fmt(d.median)}</p>
                    <p>Mean: {fmt(d.mean)}</p>
                    <p className="opacity-60">n = {d.n}</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="median" fill="#D97706" radius={[0, 3, 3, 0]} maxBarSize={18}>
              <LabelList
                dataKey="median"
                position="right"
                style={{ fontSize: 11, fill: "#6B7280" }}
                formatter={(v: unknown) => typeof v === "number" ? fmt(v) : String(v)}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </section>
  );
}
