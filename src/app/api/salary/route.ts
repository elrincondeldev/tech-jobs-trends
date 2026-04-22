import { NextRequest, NextResponse } from "next/server";
import { getReport } from "@/shared/lib/report";

type ByType = "level" | "country" | "work_mode" | "role";
const VALID: ByType[] = ["level", "country", "work_mode", "role"];

export async function GET(req: NextRequest) {
  const report = await getReport();
  if (!report) return NextResponse.json({ error: "No data" }, { status: 404 });

  const by = req.nextUrl.searchParams.get("by") as ByType | null;

  if (by) {
    if (!VALID.includes(by)) {
      return NextResponse.json({ error: "Invalid by param", valid: VALID }, { status: 400 });
    }
    const key = `by_${by}` as keyof typeof report.salary;
    return NextResponse.json({ by, note: report.salary.note, data: report.salary[key] });
  }

  return NextResponse.json({ salary: report.salary });
}
