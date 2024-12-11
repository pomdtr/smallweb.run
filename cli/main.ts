import { Cli } from "./mod.ts";
import { lastlogin, createToken } from "jsr:@pomdtr/lastlogin@0.5.13"
import { parseArgs } from "jsr:@std/cli@^1.0.7"

const cli = new Cli();
cli.fetch = lastlogin(cli.fetch)

export default {
    fetch: lastlogin(cli.fetch),
    run: async (args: string[]) => {
        const { email, help } = parseArgs(args)
        if (help) {
            console.log("Usage: cli --email <email>")
            return
        }

        if (!email) {
            console.error("Email is required")
            Deno.exitCode = 1
            return
        }
        const token = await createToken({
            email,
        })
        console.log(token)
    }
}
