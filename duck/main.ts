import { Database } from "npm:duckdb-async@1.1.3"

export default {
    fetch: async () => {
        const db = await Database.create(":memory:");
        await db.all("load httpfs");
        const res = await db.all(`select 1`);

        return Response.json(res);
    }
}
