import { NextRequest, NextResponse } from "next/server";
import { getReport } from "@/shared/lib/report";

export async function GET(req: NextRequest) {
  const report = await getReport();
  if (!report) return NextResponse.json({ error: "No data" }, { status: 404 });

  const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "20");
  const roles = report.roles.slice(0, limit);

  return NextResponse.json({ total: report.roles.length, roles });
}
