import type { LogEntry } from "./types.ts";

// TODO: use streaming, do not load all logs into memory
export default {
    fetch: () => {
        const rows = Deno.readTextFileSync("logs.jsonl").trim().split("\n")
        const entries: LogEntry[] = rows.map((row) => JSON.parse(row))
        const msgs = entries.map((entry) => `${entry.request.method} ${entry.request.host} ${entry.request.uri} ${entry.status}`)

        return new Response(msgs.join("\n"), {
            headers: { "content-type": "text/plain" },
        });
    }
}
