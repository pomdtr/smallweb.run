import { parseArgs } from "@std/cli"
import * as path from "@std/path"

type RequestHandler = (request: Request) => Response | Promise<Response>

export function toRequest(args: string[]): Request {
    const { _, ...flags } = parseArgs(args)

    const pathname = path.join("/", ..._.map(encodeURIComponent))
    const url = new URL(pathname, "http://localhost")
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

    return new Request(url.href, {
        method: "RUN",
        body: Deno.stdin.readable
    })
}

export class HttpCli {
    handler: RequestHandler

    constructor(handler: RequestHandler) {
        this.handler = handler
    }

    run = async (args?: string[]) => {
        if (!args) {
            args = Deno.args
        }

        const request = toRequest(args)
        const response = await this.handler(request)
        if (!response.ok) {
            await response.body?.pipeTo(Deno.stderr.writable)
            return
        }

        await response.body?.pipeTo(Deno.stdout.writable)
    }

}
