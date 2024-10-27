import { Command } from "@cliffy/command"
import * as path from "@std/path"
import manifest from "./deno.json" with { type: "json" }


export interface App {
    fetch(req: Request): Response | Promise<Response>
    run(args: string[]): void | Promise<void>
}

export function createApi(): App {
    return {
        fetch: (req) => {
            const { pathname, search } = new URL(req.url)
            const url = new URL(`${pathname}${search}`, Deno.env.get("SMALLWEB_API_URL"))
            return fetch(url, req)
        },
        run: async (args) => {
            const command = new Command()
                .name(path.basename(Deno.cwd()))
                .version(manifest.version)
                .description("Smallweb Api Client")
                .arguments("<pathname:string>")
                .option("-X, --method <method:string>", "HTTP method", { default: "GET" })
                .option("-d, --data <data:string>", "Data to send in the body of the request")
                .option("-H, --header <header:string>", "Headers to send with the request", { collect: true })
                .option("-t, --api-token <token:string>", "API token")
                .env("SMALLWEB_API_TOKEN=<token:string>", "API token", {
                    prefix: "SMALLWEB_"
                })
                .action(async (opts, pathname) => {
                    const headers = new Headers()
                    for (const header of opts.header || []) {
                        const [key, value] = header.split(":")
                        headers.set(key.trim(), value.trim())
                    }

                    if (opts.apiToken) {
                        headers.set("Authorization", `Bearer ${opts.apiToken}`)
                    }

                    const body = opts.data == "@-" ? Deno.stdin.readable : opts.data
                    const resp = await fetch(new URL(pathname, globalThis.location.href), {
                        method: opts.method,
                        body,
                        headers
                    })

                    if (!resp.ok) {
                        await resp.body?.pipeTo(Deno.stdout.writable)
                        Deno.exitCode = 1
                        return
                    }

                    await resp.body?.pipeTo(Deno.stdout.writable)
                })

            await command.parse(args)
        }
    }
}
