import { open } from "jsr:@divy/duckdb@0.2";

const db = open("/tmp/test.db");
const connection = db.connect();

const q = "select i, i as a from generate_series(1, 100000) s(i)";

const p = connection.prepare(q);
console.log("benchmarking query: " + q);

p.query();

connection.close();
db.close();
