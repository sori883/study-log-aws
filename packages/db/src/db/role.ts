import { pgRole } from 'drizzle-orm/pg-core';

export const approle = pgRole('approle').existing();