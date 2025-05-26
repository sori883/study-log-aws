import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export * as schema from "./db/schema";

// 別パッケージで使用するものをexport
export * from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
export const db =  drizzle(client);
