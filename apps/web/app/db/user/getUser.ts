import { db, schema, eq } from "@acme/db";
import { z } from "zod";

export type UserType = typeof schema.usersTable.$inferSelect

const getUserSchema = z.object({
  email: z.string().email(),
});

export async function getUser(data: z.infer<typeof getUserSchema>) {
  const v = getUserSchema.parse(data);
  const user = await db
    .select()
    .from(schema.usersTable)
    .where(eq(schema.usersTable.email, v.email))
    .get();

    return user;
}