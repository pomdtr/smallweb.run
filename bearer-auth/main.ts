import { bearerAuth } from "./mod.ts"

const handleFn = (_req: Request) => new Response("Hello, world!")

export default {
    fetch: bearerAuth(handleFn, {
        verifyToken: (token: string) => token === "secret",
    })
}

