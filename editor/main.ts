import { Codejar } from "jsr:@pomdtr/smallweb-codejar@0.7.0";
import { githubAuth } from "jsr:@pomdtr/github-auth@0.4.0";

const { SMALLWEB_DIR } = Deno.env.toObject();
const codejar = new Codejar({
    fsRoot: SMALLWEB_DIR,
});

// add authentication
codejar.fetch = githubAuth(
    {
        issuer: "https://auth.smallweb.run",
        authorizedUsers: ["pomdtr"],
    },
    codejar.fetch,
);

export default codejar;
