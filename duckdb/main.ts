import { fetch } from "https://esm.town/v/std/fetch";



export let duckdbExample = await (async () => {
    async function createWorker(url) {
        // For Val Town / Deno environments
        if (typeof Deno !== "undefined") {
            return new Worker(url, { type: "module", deno: true });
        }
        // For browser environments (keeping the original logic)
        const workerScript = await fetch(url);
        const workerURL = URL.createObjectURL(await workerScript.blob());
        return new Worker(workerURL, { type: "module" });
    }
    const duckdb = await import(
        "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.17.0/+esm"
    );
    const bundles = duckdb.getJsDelivrBundles();
    const bundle = await duckdb.selectBundle(bundles);
    const logger = new duckdb.ConsoleLogger();
    const worker = await createWorker(bundle.mainWorker);
    const db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(bundle.mainModule);
    const c = await db.connect();
    const res = await c.query(`SELECT * FROM generate_series(1, 100) t(v)`);
    c.close();
    db.terminate();
    // DuckDB's toJSON unfortunately includes BigInts, and we can't serialize
    // BigInts because they have no basic JSON representation. So,
    // Translate them to ints.
    return res.toArray().map((r) => {
        const row = r.toJSON();
        return JSON.parse(JSON.stringify(row, (k, v) => {
            return typeof v === "bigint" ? +v.toString() : v;
        }));
    });
})();


console.log(duckdbExample);
