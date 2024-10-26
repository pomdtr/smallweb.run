export default {
    fetch: (req) => {
        return Response.json(
            {
                url: req.url,
                headers: Object.fromEntries(req.headers.entries())
            }
        )
    }
} satisfies Deno.ServeDefaultExport
