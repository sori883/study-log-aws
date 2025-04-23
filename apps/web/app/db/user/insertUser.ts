import { db, schema } from "@acme/db";
import { z } from "zod";

const insertUserSchema = z.object({
  email: z.string().email(),
  thumbnailUrl: z.string(),
});


export async function insertUser(data: z.infer<typeof insertUserSchema>) {
  const v = insertUserSchema.parse(data);

  await db
    .insert(schema.usersTable)
    .values({
      email: v.email,
      thumbnailUrl: v.thumbnailUrl,
    });
}