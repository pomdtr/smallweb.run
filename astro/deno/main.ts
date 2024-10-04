import * as server from "./astro/dist/server/entry.mjs";
import { serveDir } from "jsr:@std/http/file-server";

export async function handle(req: Request): Promise<Response> {
  const res = await serveDir(req, {
    fsRoot: "./astro/dist/client",
  });

  if (res.status === 404) {
    return server.handle(req);
  }

  return res;
}

export default {
  fetch: handle,
};
