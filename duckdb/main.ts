import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Buffer } from "node:buffer";
const MANUAL_BUNDLES = {
  mvp: {
    mainModule: "duckdb-mvp.wasm",
    mainWorker: "duckdb-node-blocking.cjs",
  },
};

async function ensureFileDownloaded(fileName: string) {
  const targetDir = path.dirname(fileURLToPath(import.meta.url));
  const DOWNLOAD_PREFIX =
    "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm/dist/";
  const filePath = path.join(targetDir, fileName);
  try {
    await fs.access(filePath);
  } catch (error) {
    console.log(
      `${fileName} not found. Downloading from ${DOWNLOAD_PREFIX}${fileName}...`,
    );
    const response = await fetch(`${DOWNLOAD_PREFIX}${fileName}`);
    if (!response.ok || !response.body) {
      throw new Error(`Failed to download ${fileName}: ${response.statusText}`);
    }
    const fileBuffer = await response.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(fileBuffer));
    console.log(`${fileName} downloaded successfully to ${filePath}.`);
  }
}

const wasmFileName = MANUAL_BUNDLES.mvp.mainModule;
const workerFileName = MANUAL_BUNDLES.mvp.mainWorker;

await ensureFileDownloaded(wasmFileName);
await ensureFileDownloaded(workerFileName);

const workerModule = await import("./" + workerFileName);
const worker_blocking = workerModule.default;

const logger = new worker_blocking.ConsoleLogger();
const ddb = await worker_blocking.createDuckDB(
  MANUAL_BUNDLES,
  logger,
  worker_blocking.NODE_RUNTIME,
);

await ddb.instantiate(
  MANUAL_BUNDLES.mvp.mainModule,
  MANUAL_BUNDLES.mvp.mainWorker,
);

const db = await ddb.connect();
const mainTsAbsolutePath = fileURLToPath(import.meta.url);
ddb.registerFileURL(
  `main.ts`,
  mainTsAbsolutePath,
  worker_blocking.DuckDBDataProtocol.NODE_FS,
  false,
);
console.log(
  "Demo query with fs access:",
  await db.query("select md5(content) as md5 from read_text('main.ts')")
    .toArray()[0].md5,
);
