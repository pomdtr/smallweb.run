import type * as smallweb from "./mod.ts"

export default {
    fetch: (_req) => new Response("Hello, World!"),
} satisfies smallweb.DefaultExport;

