import { pgTableCreator } from "drizzle-orm/pg-core";

/**
 * DBテーブル名にprefixをつける
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `study_aws_${name}`);