import { NextRequest, NextResponse } from "next/server";
import { getReport } from "@/shared/lib/report";

export async function GET(req: NextRequest) {
  const report = await getReport();
  if (!report) return NextResponse.json({ error: "No data" }, { status: 404 });

  const role = req.nextUrl.searchParams.get("role");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "20");

  if (role) {
    const roleData = report.skills.by_role[role.toLowerCase()];
    if (!roleData) {
      const available = Object.keys(report.skills.by_role);
      return NextResponse.json({ error: "Role not found", available }, { status: 404 });
    }
    return NextResponse.json({
      role,
      total_jobs: roleData.total_jobs,
      skills: roleData.top_skills.slice(0, limit),
    });
  }

  return NextResponse.json({
    skills: report.skills.top_overall.slice(0, limit),
    available_roles: Object.keys(report.skills.by_role),
  });
}
