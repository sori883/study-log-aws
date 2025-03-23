import { sql } from "drizzle-orm";
import { createCaTable } from "./_table";
import { integer, text } from "drizzle-orm/sqlite-core";

export const profilesTable = createCaTable("profiles_table", {
  id: integer().primaryKey({ autoIncrement: true }),
});