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
            const headers = new Headers(req.headers)
            headers.set("Authorization", `Bearer ${Deno.env.get("SMALLWEB_API_TOKEN")}`)
            return fetch(url, {
                method: req.method,
                headers,
                body: req.body
            })
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
                .env("SMALLWEB_API_URL=<value:string>", "Smallweb API URL", { prefix: "SMALLWEB_", required: true })
                .env("SMALLWEB_API_TOKEN=<value:string>", "Smallweb API Token", { prefix: "SMALLWEB_" })
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
                    const resp = await fetch(new URL(pathname, opts.apiUrl), {
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
