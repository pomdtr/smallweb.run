import { decodeBase64 } from "jsr:@std/encoding"

export default {
    fetch: async (req: Request) => {
        const url = new URL(req.url);
        const [name, ...args] = url.pathname.slice(1).split("/").map(decodeURIComponent);
        const resp = await fetch(`https://api.smallweb.run/v0/run/${name}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Deno.env.get('SMALLWEB_API_TOKEN')}`
            },
            body: JSON.stringify({
                args
            })
        })

        if (!resp.ok) {
            return new Response("Error fetching data", { status: 500 });
        }

        const { code, stdout, stderr } = await resp.json();
        if (code !== 0) {
            return new Response(decodeBase64(stderr), { status: 500 });
        }

        return new Response(decodeBase64(stdout));
    }
}
