import { lastlogin } from "./mod.ts";

const handleRequest = () => {
    return new Response("Hello, world!");
}

export default {
    fetch: lastlogin(handleRequest, {
        verifyEmail: (email) => {
            return email === Deno.env.get("EMAIL")
        },
        provider: "google",
        public_routes: ["/public"],
    })
}
