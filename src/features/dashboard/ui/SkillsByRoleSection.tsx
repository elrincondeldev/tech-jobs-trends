"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { RoleSkillData } from "@/entities/report/model/types";
import { useIsMobile } from "@/shared/lib/useIsMobile";

interface Props {
  byRole: Record<string, RoleSkillData>;
}

const FEATURED_ROLES = [
  "backend", "frontend", "full stack", "devops", "data engineer",
  "machine learning engineer", "ai engineer", "data scientist", "data analyst",
  "software engineer", "mobile",
];

export function SkillsByRoleSection({ byRole }: Props) {
  const roles = FEATURED_ROLES.filter((r) => byRole[r]);
  const [active, setActive] = useState(roles[0]);
  const isMobile = useIsMobile();

  const chartMargin = isMobile
    ? { top: 0, right: 30, left: 0, bottom: 0 }
    : { top: 0, right: 60, left: 120, bottom: 0 };
  const yAxisWidth = isMobile ? 88 : 116;

  const roleData = byRole[active];
  const chartData = roleData?.top_skills.slice(0, 10).map((s) => ({
    name: s.skill.length > 22 ? s.skill.slice(0, 22) + "…" : s.skill,
    fullName: s.skill,
    pct: s.pct,
    jobs: s.jobs,
  })) ?? [];

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <p className="text-xs font-mono text-[var(--secondary)] uppercase tracking-widest mb-2">
        Skills by Role
      </p>
      <h2 className="font-display text-3xl font-bold text-[var(--primary)] mb-2">
        What Each Role Needs
      </h2>
      <p className="text-[var(--text-muted)] text-sm mb-8">
        Top skills required by role. Select a role to explore.
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => setActive(role)}
            className={`px-3 py-1.5 text-xs font-medium capitalize cursor-pointer transition-colors border ${
              active === role
                ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                : "bg-transparent text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
          className="border border-[var(--border)] p-6"
        >
          <div className="flex items-baseline justify-between mb-6">
            <h3 className="font-display font-semibold text-base text-[var(--primary)] capitalize">
              {active}
            </h3>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              {roleData?.total_jobs.toLocaleString()} total jobs
            </span>
          </div>

          <ResponsiveContainer width="100%" height={340}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={chartMargin}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
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
                content={({ active: a, payload }) => {
                  if (!a || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-[var(--primary)] text-white px-3 py-2 text-xs font-mono">
                      <p className="font-bold mb-0.5">{d.fullName}</p>
                      <p>{d.jobs.toLocaleString()} jobs · {d.pct}%</p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="pct" fill="#8B5CF6" radius={[0, 2, 2, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
