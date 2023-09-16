import { env } from "bun";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB } from "./types"; // this is the Database interface we defined earlier

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: env.DATABASE_URL,
    ssl: true,
    max: 10,
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<DB>({
  dialect,
});
