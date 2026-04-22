import { NextResponse } from "next/server";
import { getDb } from "@/shared/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = {
    env: {
      MONGODB_URI: !!process.env.MONGODB_URI,
      MONGODB_DB_NAME: process.env.MONGODB_DB_NAME ?? null,
      MONGODB_COLLECTION: process.env.MONGODB_COLLECTION ?? null,
    },
    mongodb: "untested" as string,
    count: null as number | null,
  };

  try {
    const db = await getDb();
    const collection = process.env.MONGODB_COLLECTION ?? "tech_jobs_data";
    status.count = await db.collection(collection).countDocuments();
    status.mongodb = "ok";
  } catch (err) {
    status.mongodb = err instanceof Error ? err.message : String(err);
  }

  const ok = status.mongodb === "ok" && status.count !== null && status.count > 0;
  return NextResponse.json(status, { status: ok ? 200 : 500 });
}
