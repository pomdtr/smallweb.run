import { Codejar } from "./mod.ts";
import { githubAuth } from "jsr:@pomdtr/github-auth@0.3.5";

const codejar = new Codejar();
codejar.fetch = githubAuth({
  issuer: "https://auth.smallweb.run",
  authorizedUsers: ["pomdtr"],
}, codejar.fetch);

export default codejar;
