import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./db/schema";

const client = createClient({ 
  url: process.env.TURSO_DATABASE_URL!, 
  authToken: process.env.TURSO_AUTH_TOKEN!
});


export const db = drizzle({ client, schema });
export * as schema from "./db/schema";

// 別パッケージで使用するものをexport
export * from "drizzle-orm";

// export * from "drizzle-orm"だけではエクスポートされないので、個別にエクスポート
export {
  union,
  unionAll,
  intersect,
  except,
} from "drizzle-orm/sqlite-core";
