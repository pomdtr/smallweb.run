export default {
    fetch: async () => {
        const resp = await fetch("https://raw.githubusercontent.com/pomdtr/smallweb/refs/heads/main/api/openapi.json")
        if (!resp.ok) {
            return new Response("Failed to fetch OpenAPI spec", { status: 500 })
        }

        return new Response(resp.body, {
            headers: {
                "content-type": "application/json",
            },
        })
    }
}
