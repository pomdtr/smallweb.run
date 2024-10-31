import { parseArgs } from "jsr:@std/cli"
import * as path from "jsr:@std/path"

export function createCli(handler: (req: Request) => Response | Promise<Response>) {
    return async (args?: string[]) => {
        if (!args) {
            args = Deno.args
        }
        const { _, ...flags } = parseArgs(args)

        const pathname = path.join("/", ..._.map(encodeURIComponent))
        const url = new URL(pathname, globalThis.location.href)
        for (const [key, value] of Object.entries(flags)) {
            switch (typeof value) {
                case "boolean":
                    url.searchParams.set(key, "")
                    break
                case "object":
                    if (Array.isArray(value)) {
                        for (const item of value) {
                            url.searchParams.append(key, item)
                        }
                    }
                    break
                default:
                    url.searchParams.set(key, value)
            }
        }

        const request = new Request(url.href, {
            method: "RUN",
            body: Deno.stdin.readable
        })

        const response = await handler(request)
        if (!response.ok) {
            Deno.exitCode = 1
            await response.body?.pipeTo(Deno.stderr.writable)
            return
        }

        await response.body?.pipeTo(Deno.stdout.writable)
    }
}
