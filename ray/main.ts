import { Ray } from "./mod.ts";
import { lastlogin } from "jsr:@pomdtr/lastlogin@0.5.2";

const { SMALLWEB_DIR } = Deno.env.toObject();

const ray = new Ray(SMALLWEB_DIR);
ray.fetch = lastlogin(ray.fetch);

export default ray;
