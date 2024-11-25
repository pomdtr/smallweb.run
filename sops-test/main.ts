export default {
    fetch: () => new Response(Deno.env.get("test") || "undefined"),
}
