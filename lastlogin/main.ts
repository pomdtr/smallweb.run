import { lastlogin } from "./mod.ts";

const handler = (req: Request) => {
  const email = req.headers.get("X-Lastlogin-Email");
  return new Response(`Hello, ${email}!`);
};

export default {
  fetch: lastlogin(handler, {
    provider: "google",
    private: true,
    verifyEmail: (email: string) => {
      return email == Deno.env.get("EMAIL");
    },
  }),
};
