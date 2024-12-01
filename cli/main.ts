import { Cli } from "./mod.ts";
import { lastlogin, createToken } from "jsr:@pomdtr/lastlogin@0.5.10"
import { parseArgs } from "@std/cli"

const cli = new Cli();
cli.fetch = lastlogin(cli.fetch)

export default {
    fetch: lastlogin(cli.fetch),
    run: async (args: string[]) => {
        const { email } = parseArgs(args)
        const token = await createToken({
            email,
            domain: Deno.env.get("SMALLWEB_APP_DOMAIN"),
            exp: Date.now() + 1000 * 60 * 60 * 24 * 7
        })
        console.log(token)
    }
}
