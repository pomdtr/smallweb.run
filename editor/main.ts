import { Codejar } from "jsr:@pomdtr/smallweb-codejar@0.4.1";
import { githubAuth } from "jsr:@pomdtr/github-auth@0.2.2";

const { SMALLWEB_DIR } = Deno.env.toObject();
const codejar = new Codejar(SMALLWEB_DIR);

// add authentication
codejar.fetch = githubAuth(
    { issuer: "https://auth.smallweb.run" },
    codejar.fetch,
);

export default codejar;
