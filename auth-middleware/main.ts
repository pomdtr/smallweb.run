import { openauth } from "./mod.ts";

export default {
    fetch: openauth({
        issuer: "https://auth.smallweb.run",
    }, (req: Request) => {
        const email = req.headers.get("x-user-email");
        return new Response(`Hello ${email}!`);
    }),
};
