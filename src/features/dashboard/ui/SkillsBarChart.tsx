"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import type { SkillEntry } from "@/entities/report/model/types";
import { UnknownNote } from "@/shared/ui/UnknownNote";

const CATEGORY_COLORS: Record<string, string> = {
  Language: "#8B5CF6",
  Framework: "#7C3AED",
  Database: "#16A34A",
  Cloud: "#2563EB",
  Container: "#0891B2",
  "DevOps/CI-CD": "#D97706",
  "AI/ML Framework": "#EC4899",
  "AI/ML Concept": "#DB2777",
  Analytics: "#059669",
  "Developer Tool": "#6366F1",
  Methodology: "#F59E0B",
  "Protocol/API": "#64748B",
  Architecture: "#0F172A",
  Other: "#9CA3AF",
};

interface Props {
  skills: SkillEntry[];
  totalOffers: number;
  withTechnologies: number;
}

export function SkillsBarChart({ skills, totalOffers, withTechnologies }: Props) {
  const withoutTech = totalOffers - withTechnologies;
  const withoutPct = Math.round((withoutTech / totalOffers) * 100 * 10) / 10;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const data = skills.slice(0, 20).map((s) => ({
    name: s.skill,
    jobs: s.jobs,
    pct: s.pct,
    category: s.category,
    color: CATEGORY_COLORS[s.category] ?? "#9CA3AF",
  }));

  return (
    <section id="skills" className="py-16 px-6 max-w-7xl mx-auto">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <SectionLabel>Top Skills</SectionLabel>
        <h2 className="font-display text-3xl font-bold text-[var(--primary)] mb-2">
          Most In-Demand Technologies
        </h2>
        <p className="text-[var(--text-muted)] text-sm">
          Percentage of job postings requiring each skill.
        </p>
        <UnknownNote
          count={withoutTech}
          pct={withoutPct}
          label="didn't list any technologies and are excluded from this chart"
        />

        <div className="flex flex-wrap gap-3 mt-6 mb-8">
          {Array.from(new Set(data.map((d) => d.category))).slice(0, 10).map((cat) => (
            <span
              key={cat}
              className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)]"
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: CATEGORY_COLORS[cat] ?? "#9CA3AF" }}
              />
              {cat}
            </span>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={520}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 60, left: 120, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}`}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
              width={116}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-[var(--primary)] text-white px-3 py-2 text-xs font-mono">
                    <p className="font-bold mb-0.5">{d.name}</p>
                    <p>{d.jobs.toLocaleString()} jobs · {d.pct}%</p>
                    <p className="opacity-60">{d.category}</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="jobs" radius={[0, 2, 2, 0]} maxBarSize={18}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-mono text-[var(--secondary)] uppercase tracking-widest mb-2">
      {children}
    </p>
  );
}
