import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { PgTransaction } from "drizzle-orm/pg-core";
import { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import { ExtractTablesWithRelations, sql } from "drizzle-orm";

export * as schema from "./db/schema";

// 別パッケージで使用するものをexport
export * from "drizzle-orm";

type QueryInTransaction<T> = (
  tx: PgTransaction<
    PostgresJsQueryResultHKT,
    Record<string, never>,
    ExtractTablesWithRelations<Record<string, never>>
  >
) => Promise<T>;

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
export const db =  drizzle(client);
