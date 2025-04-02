import { Ray } from "./mod.ts";

const { SMALLWEB_DIR, SMALLWEB_ADMIN } = Deno.env.toObject();

if (!SMALLWEB_ADMIN) {
  throw new Error("app is not an admin app");
}

const ray = new Ray({
  rootDir: SMALLWEB_DIR,
});

export default ray;
