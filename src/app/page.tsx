import { getReport } from "@/shared/lib/report";
import { NavBar } from "@/features/nav/ui/NavBar";
import { HeroStats } from "@/features/dashboard/ui/HeroStats";
import { SkillsBarChart } from "@/features/dashboard/ui/SkillsBarChart";
import { RolesChart } from "@/features/dashboard/ui/RolesChart";
import { DistributionSection } from "@/features/dashboard/ui/DistributionSection";
import { SalarySection } from "@/features/dashboard/ui/SalarySection";
import { SkillsByRoleSection } from "@/features/dashboard/ui/SkillsByRoleSection";

export const dynamic = "force-dynamic";

export default async function Home() {
  const report = await getReport();

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-sm text-[var(--text-muted)]">No data available.</p>
      </div>
    );
  }

  const remotePct = report.distribution.by_work_mode.find((w) => w.value === "remote")?.pct ?? 0;
  const topCountry = report.distribution.by_country.find((c) => c.value !== "unknown");

  return (
    <>
      <NavBar />
      <main>
        <HeroStats
          totalOffers={report.overview.total_offers}
          salaryPct={report.overview.with_salary_pct}
          remotePct={remotePct}
          topCountry={topCountry?.value ?? "Chile"}
          topCountryJobs={topCountry?.jobs ?? 0}
        />

        <div className="border-t border-[var(--border)]" />

        <SkillsBarChart
          skills={report.skills.top_overall}
          totalOffers={report.overview.total_offers}
          withTechnologies={report.overview.with_technologies}
        />

        <div className="border-t border-[var(--border)]" />

        <RolesChart roles={report.roles} />

        <div className="border-t border-[var(--border)]" />

        <DistributionSection
          workMode={report.distribution.by_work_mode}
          byLevel={report.distribution.by_level}
          byCountry={report.distribution.by_country}
        />

        <div className="border-t border-[var(--border)]" />

        <SalarySection
          global={report.salary.global}
          byRole={report.salary.by_role}
          totalOffers={report.overview.total_offers}
          withSalary={report.overview.with_salary}
        />

        <div className="border-t border-[var(--border)]" />

        <SkillsByRoleSection byRole={report.skills.by_role} />
      </main>
    </>
  );
}
