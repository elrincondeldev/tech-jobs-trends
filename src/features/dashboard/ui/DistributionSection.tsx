"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import type { DistributionEntry } from "@/entities/report/model/types";
import { UnknownNote } from "@/shared/ui/UnknownNote";

const WORK_MODE_COLORS = ["#111111", "#8B5CF6", "#16A34A"];
const LEVEL_COLORS = ["#111111", "#374151", "#6B7280", "#9CA3AF", "#D1D5DB"];

interface Props {
  workMode: DistributionEntry[];
  byLevel: DistributionEntry[];
  byCountry: DistributionEntry[];
}

function DonutCard({
  title,
  data,
  colors,
}: {
  title: string;
  data: { name: string; value: number; pct: number }[];
  colors: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="border border-border p-6"
    >
      <h3 className="font-display font-semibold text-base text-primary mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={76}
            dataKey="value"
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="bg-primary text-white px-3 py-2 text-xs font-mono">
                  <p className="font-bold capitalize">{d.name}</p>
                  <p>{d.value.toLocaleString()} jobs · {d.pct}%</p>
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
              <span className="capitalize text-muted">{d.name}</span>
            </span>
            <span className="font-mono text-primary">{d.pct}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function DistributionSection({ workMode, byLevel, byCountry }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const countryUnknown = byCountry.find((c) => c.value === "unknown");
  const levelUnknown = byLevel.find((l) => l.value === "unknown");

  const countries = byCountry
    .filter((c) => c.value !== "unknown")
    .slice(0, 10)
    .map((c) => ({ name: c.value, jobs: c.jobs, pct: c.pct }));

  const workModeData = workMode.map((w) => ({ name: w.value, value: w.jobs, pct: w.pct }));
  const levelData = byLevel
    .filter((l) => l.value !== "unknown" && l.value !== "expert" && l.value !== "no_experience")
    .map((l) => ({ name: l.value, value: l.jobs, pct: l.pct }));

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <p className="text-xs font-mono text-secondary uppercase tracking-widest mb-2">
        Distribution
      </p>
      <h2 className="font-display text-3xl font-bold text-primary mb-2">
        Market Breakdown
      </h2>
      <p className="text-muted text-sm">
        Work mode, seniority level, and geographic distribution.
      </p>
      {levelUnknown && (
        <UnknownNote
          count={levelUnknown.jobs}
          pct={levelUnknown.pct}
          label="didn't specify seniority level and are excluded from the level chart"
        />
      )}

      <div className="grid md:grid-cols-2 gap-6 mt-8 mb-12">
        <DonutCard title="Work Mode" data={workModeData} colors={WORK_MODE_COLORS} />
        <DonutCard title="Seniority Level" data={levelData} colors={LEVEL_COLORS} />
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="border border-border p-6"
      >
        <h3 className="font-display font-semibold text-base text-primary mb-1">
          Jobs by Country
        </h3>
        {countryUnknown && (
          <UnknownNote
            count={countryUnknown.jobs}
            pct={countryUnknown.pct}
            label="had no country specified and are excluded from this chart"
          />
        )}
        <div className="mt-5" />
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={countries}
            layout="vertical"
            margin={{ top: 0, right: 60, left: 100, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
              width={96}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-primary text-white px-3 py-2 text-xs font-mono">
                    <p className="font-bold">{d.name}</p>
                    <p>{d.jobs.toLocaleString()} jobs · {d.pct}%</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="jobs" fill="#8B5CF6" radius={[0, 2, 2, 0]} maxBarSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </section>
  );
}
