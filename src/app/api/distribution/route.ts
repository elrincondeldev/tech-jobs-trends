import { NextRequest, NextResponse } from "next/server";
import { getReport } from "@/shared/lib/report";

type DistType = "level" | "work_mode" | "country" | "platform" | "category" | "contract";

const VALID_TYPES: DistType[] = ["level", "work_mode", "country", "platform", "category", "contract"];

export async function GET(req: NextRequest) {
  const report = await getReport();
  if (!report) return NextResponse.json({ error: "No data" }, { status: 404 });

  const type = req.nextUrl.searchParams.get("type") as DistType | null;

  if (type) {
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid type", valid_types: VALID_TYPES }, { status: 400 });
    }
    const key = `by_${type}` as keyof typeof report.distribution;
    return NextResponse.json({ type, data: report.distribution[key] });
  }

  return NextResponse.json({ distribution: report.distribution });
}
