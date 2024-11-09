import { codejar } from "./mod.ts";
import { lastlogin } from "@pomdtr/lastlogin";
import { getContext } from "@smallweb/ctx";

const { app } = getContext();

const handler = codejar(app.dir);

export default {
    fetch: lastlogin(handler.fetch, {
        private: true,
        verifyEmail: (email) => {
            return email === Deno.env.get("EMAIL");
        },
    }),
};
