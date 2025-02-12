export default {
    async fetch() {
        const body = await Deno.readFile("../.smallweb/authorized_keys");
        return new Response(body);
    },
};
