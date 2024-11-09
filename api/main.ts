import { bearerAuth } from "jsr:@pomdtr/bearer-auth@0.1.0";
import { createApi } from "./mod.ts";

const api = createApi();

export default {
    fetch: bearerAuth(api.fetch, {
        verifyToken: (token: string) => {
            return token === Deno.env.get("API_TOKEN");
        },
        publicRoutes: ["/", "/openapi.json"],
    }),
    run: api.run,
};
