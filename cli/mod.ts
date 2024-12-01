import { mergeReadableStreams } from "@std/streams"
import { accepts } from "@std/http/negotiation"

export class Cli {
    constructor() { }

    fetch: (req: Request) => Response | Promise<Response> = async (req) => {
        const { SMALLWEB_ADMIN, SMALLWEB_CLI_PATH } = Deno.env.toObject();
        if (!SMALLWEB_ADMIN) {
            return new Response("Not an admin app", {
                status: 500,
                headers: new Headers({
                    "content-type": "text/plain",
                }),
            })
        }
        const url = new URL(req.url)
        const args: string[] = []
        if (url.pathname != "/") {
            args.push(...url.pathname.slice(1).split("/").map(decodeURIComponent))
        }

        for (const [key, value] of url.searchParams) {
            if (key.length == 1) {
                if (value === "") {
                    args.push(`-${key}`)
                    continue
                }

                args.push(`-${key}`, value)
            }

            if (value === "") {
                args.push(`--${key}`)
                continue
            }

            args.push(`--${key}`, value)
        }

        const accept = accepts(req, "text/html", "application/json", "text/json")
        if (accept && accept != "text/html") {
            try {
                const command = new Deno.Command(SMALLWEB_CLI_PATH)
                const output = await command.output()
                return Response.json({
                    success: output.success,
                    signal: output.signal,
                    code: output.code,
                    stdout: new TextDecoder().decode(output.stdout),
                    stderr: new TextDecoder().decode(output.stderr),
                })
            } catch (e) {
                if (e instanceof Error) {
                    return Response.json({
                        error: e.message
                    }, {
                        status: 500
                    })
                }
                return Response.json({
                    error: "Unknown error"
                }, {
                    status: 500
                })
            }
        }

        try {
            const command = new Deno.Command(SMALLWEB_CLI_PATH, {
                args,
                stdout: "piped",
                stderr: "piped",
                stdin: "null",
            })

            const ps = await command.spawn()
            const merged = mergeReadableStreams(ps.stdout, ps.stderr)
            return new Response(merged, {
                status: 200,
                headers: new Headers({
                    "content-type": "text/plain",
                    "Transfer-Encoding": "chunked",
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                    "X-Content-Type-Options": "nosniff",
                }),
            })
        } catch (e) {
            if (e instanceof Error) {
                return new Response(e.message, {
                    status: 500,
                    headers: new Headers({
                        "content-type": "text/plain",
                    }),
                })
            }

            return new Response("Unknown error", {
                status: 500,
                headers: new Headers({
                    "content-type": "text/plain",
                }),
            })
        }
    }
}
