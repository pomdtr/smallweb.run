export default {
    fetch: async (req) => {
        return Response.json(
            {
                url: req.url,
                method: req.method,
                body: req.method == "POST" ? await req.text() : undefined,
                headers: Object.fromEntries(req.headers.entries())
            }
        )
    }
} satisfies Deno.ServeDefaultExport
