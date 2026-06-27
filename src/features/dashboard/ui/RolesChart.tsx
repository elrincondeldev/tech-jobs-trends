"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell,
} from "recharts";
import type { RoleEntry } from "@/entities/report/model/types";
import { UnknownNote } from "@/shared/ui/UnknownNote";
import { useIsMobile } from "@/shared/lib/useIsMobile";

interface Props {
  roles: RoleEntry[];
}

const BAR_COLOR_START = "#111111";
const BAR_COLOR_END = "#6B7280";

function interpolateColor(start: string, end: string, t: number): string {
  const h = (hex: string) => parseInt(hex.replace("#", ""), 16);
  const sr = (h(start) >> 16) & 255, sg = (h(start) >> 8) & 255, sb = h(start) & 255;
  const er = (h(end) >> 16) & 255, eg = (h(end) >> 8) & 255, eb = h(end) & 255;
  const r = Math.round(sr + (er - sr) * t);
  const g = Math.round(sg + (eg - sg) * t);
  const b = Math.round(sb + (eb - sb) * t);
  return `rgb(${r},${g},${b})`;
}

export function RolesChart({ roles }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const isMobile = useIsMobile();

  const chartMargin = isMobile
    ? { top: 0, right: 45, left: 0, bottom: 0 }
    : { top: 0, right: 80, left: 130, bottom: 0 };
  const yAxisWidth = isMobile ? 90 : 126;

  const other = roles.find((r) => r.role === "other");
  const data = roles
    .filter((r) => r.role !== "other")
    .slice(0, 15)
    .map((r) => ({ name: r.role, jobs: r.jobs, pct: r.pct }));

  return (
    <section id="roles" className="py-16 px-6 max-w-7xl mx-auto">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs font-mono text-[var(--secondary)] uppercase tracking-widest mb-2">
          Roles
        </p>
        <h2 className="font-display text-3xl font-bold text-[var(--primary)] mb-2">
          Jobs by Role
        </h2>
        <p className="text-[var(--text-muted)] text-sm">
          Distribution of open positions across tech roles.
        </p>
        {other && (
          <UnknownNote
            count={other.jobs}
            pct={other.pct}
            label="couldn't be classified into a specific role and are excluded from this chart"
          />
        )}

        <div className="mt-6 flex items-center gap-4">
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Top {data.length} roles shown
          </span>
          {other && (
            <>
              <span className="h-3 w-px bg-[var(--border)]" />
              <span className="text-xs font-mono text-[var(--text-muted)]">
                {data.reduce((s, d) => s + d.jobs, 0).toLocaleString()} classified
              </span>
            </>
          )}
        </div>

        <div className="mt-6" />
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
                    <p className="font-bold capitalize mb-0.5">{d.name}</p>
                    <p>{d.jobs.toLocaleString()} jobs · {d.pct}%</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="jobs" radius={[0, 3, 3, 0]} maxBarSize={18}>
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={interpolateColor(BAR_COLOR_START, BAR_COLOR_END, i / Math.max(data.length - 1, 1))}
                />
              ))}
              <LabelList
                dataKey="jobs"
                position="right"
                style={{ fontSize: 11, fill: "#6B7280" }}
                formatter={(v: unknown) => typeof v === "number" ? v.toLocaleString() : String(v)}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </section>
  );
}
