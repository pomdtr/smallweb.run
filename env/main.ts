import { lastlogin } from "jsr:@pomdtr/lastlogin@0.5.13";

export default {
    fetch: lastlogin(() => Response.json(Deno.env.toObject()))
}
