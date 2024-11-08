import { lastlogin } from "./mod.ts";

const handleRequest = () => {
  return new Response("Hello, world!");
};

export default {
  fetch: lastlogin(handleRequest, {
    provider: "google",
    private: true,
    verifyEmail: (email: string) => {
      return email == Deno.env.get("EMAIL");
    },
  }),
};
