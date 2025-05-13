import { db, schema, eq } from "@acme/db";
import { z } from "zod";

const updateInitUserSchema = z.object({
  username: z.string(),
  providerUsername: z.string(),
  displayName: z.string(),
});


export async function updateInitUser(data: z.infer<typeof updateInitUserSchema>) {
  const v = updateInitUserSchema.parse(data);

  await db
    .update(schema.usersTable)
    .set({
      username: v.username,
      providerUsername: v.providerUsername,
      displayName: v.displayName,
    })
    .where(eq(schema.usersTable.providerUsername, v.providerUsername));
}