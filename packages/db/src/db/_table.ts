import { sqliteTableCreator } from "drizzle-orm/sqlite-core";

/**
 * DBテーブル名にprefixをつける
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createCaTable = sqliteTableCreator((name) => `study_aws_${name}`);