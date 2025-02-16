import { githubAuth } from "jsr:@pomdtr/github-auth@0.3.5";

export default {
    fetch: githubAuth({
        issuer: "https://auth.smallweb.run",
        authorizedKeys: ["pomdtr"],
    }, () => Response.json(Deno.env.toObject())),
};
