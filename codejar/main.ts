import { Codejar } from "./mod.ts";
import { lastlogin } from "@pomdtr/lastlogin";
import { getContext } from "@smallweb/ctx";

const { app } = getContext();

const codejar = new Codejar(app.dir);

export default {
    fetch: lastlogin(codejar.fetch, {
        private: true,
        verifyEmail: (email) => {
            return email === Deno.env.get("EMAIL");
        },
    }),
};
