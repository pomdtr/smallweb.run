import { lastlogin } from "./mod.ts";

export default {
  fetch: lastlogin((req: Request) => {
    const email = req.headers.get("X-Lastlogin-Email");
    return new Response(`Hello, ${email}!`);
  }),
};
