import { NextResponse } from "next/server";
import { getReport } from "@/shared/lib/report";

export async function GET() {
  const report = await getReport();
  if (!report) return NextResponse.json({ error: "No data" }, { status: 404 });
  return NextResponse.json({ meta: report.meta, overview: report.overview });
}
