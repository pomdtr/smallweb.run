import { Ray } from "./mod.ts";
import { githubAuth } from "jsr:@pomdtr/github-auth@0.3.5";

const { SMALLWEB_DIR } = Deno.env.toObject();

const ray = new Ray(SMALLWEB_DIR);
ray.fetch = githubAuth({
  issuer: "https://auth.smallweb.run",
  authorizedUsers: ["pomdtr"],
}, ray.fetch);

export default ray;
