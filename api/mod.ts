import { encodeBase64, decodeBase64 } from "jsr:@std/encoding/base64"


export class Smallweb {
    execPath?: string
    api: (input: RequestInfo | URL, init?: RequestInit) => Response | Promise<Response> = this.createHandler(["api", "-"])
    webdav: (input: RequestInfo | URL, init?: RequestInit) => Response | Promise<Response> = this.createHandler(["webdav", "-"])

    constructor(execPath?: string) {
        this.execPath = execPath || Deno.env.get("SMALLWEB_EXEC_PATH")
    }

    createHandler(args: string[]): (input: RequestInfo | URL, init?: RequestInit) => Response | Promise<Response> {
        return async (input: RequestInfo | URL, init?: RequestInit) => {
            if (!this.execPath) {
                throw new Error("execPath is not set")
            }

            if (typeof input === "string" && input.startsWith("/")) {
                input = new URL(input, "http://smallweb")
            }

            const req = new Request(input, init)
            const payload = JSON.stringify({
                url: req.url,
                method: req.method,
                headers: Object.fromEntries(req.headers),
                body: encodeBase64(await req.arrayBuffer()),
            })

            const command = new Deno.Command(this.execPath, {
                args,
                stdin: "piped",
                stdout: "piped",
                stderr: "piped"
            })

            const process = command.spawn()
            const writer = process.stdin.getWriter()
            await writer.write(new TextEncoder().encode(payload))
            writer.close()

            const res = await process.output()
            if (!res.success) {
                return new Response(res.stderr, { status: 500 })
            }

            const output = JSON.parse(new TextDecoder().decode(res.stdout))
            return new Response(decodeBase64(output.body), {
                status: output.status,
                statusText: output.statusText,
                headers: output.headers,
            })
        }
    }
}

type App = {
    fetch: (req: Request) => Response | Promise<Response>
}


const smallweb = new Smallweb()

export function createApi(): App {
    return {
        fetch: smallweb.api
    }
}
