export default {
    fetch: () => Response.json(Deno.env.toObject())
};
