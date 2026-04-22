import { getDb } from "./mongodb";
import type { ReportDocument } from "@/entities/report/model/types";

const COLLECTION = process.env.MONGODB_COLLECTION ?? "tech_jobs_data";

export async function getReport(): Promise<ReportDocument | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne<ReportDocument>(
    {},
    { projection: { _id: 0 }, sort: { "meta.generated_at": -1 } }
  );
  return doc;
}
