import { Command } from "@cliffy/command"
import * as path from "@std/path"


export interface App {
    fetch(req: Request): Response | Promise<Response>
    run(args: string[]): void | Promise<void>
}

export function createAPI(): App {
    return {
        fetch: (req) => {
            const url = new URL(req.url)
            return fetch(new URL(`${url.pathname}${url.search}`, Deno.env.get("SMALLWEB_API_URL")), req)
        },
        run: async (args) => {
            const command = new Command()
                .name(path.basename(Deno.cwd()))
                .version("0.1.0")
                .description("Smallweb CLI")
                .arguments("<pathname:string>")
                .option("-X, --method <method:string>", "HTTP method", { default: "GET" })
                .option("-d, --data <data:string>", "Data to send in the body of the request")
                .option("-H, --header <header:string>", "Headers to send with the request", { collect: true })
                .action(async (opts, path) => {
                    const headers = new Headers()
                    for (const header of opts.header || []) {
                        const [key, value] = header.split(":")
                        headers.set(key.trim(), value.trim())
                    }

                    if (Deno.env.has("SMALLWEB_API_TOKEN")) {
                        headers.set("Authorization", `Bearer ${Deno.env.get("SMALLWEB_API_TOKEN")}`)
                    }

                    const body = opts.data == "@-" ? Deno.stdin.readable : opts.data
                    const resp = await fetch(new URL(path, globalThis.location.href), {
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
