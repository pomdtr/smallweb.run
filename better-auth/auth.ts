import { betterAuth } from "better-auth";
import { ensureDir } from "@std/fs"
import { DB as Sqlite } from '@pomdtr/sqlite';
import { DenoSqliteDialect } from '@soapbox/kysely-deno-sqlite';

await ensureDir("data");

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true
    },
    database: {
        dialect: new DenoSqliteDialect({
            database: new Sqlite("data/db.sqlite")
        }),
        type: "sqlite",
    }
});
