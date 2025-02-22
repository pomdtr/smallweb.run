import { Codejar } from "./pkg/mod.ts";
import { githubAuth } from "jsr:@pomdtr/github-auth@0.4.1";

const codejar = new Codejar({
  fsRoot: "./data",
});

codejar.fetch = githubAuth({
  issuer: "https://auth.smallweb.run",
  authorizedUsers: ["pomdtr"],
}, codejar.fetch);

export default codejar;
