import { encodeBase64, decodeBase64 } from "@std/encoding/base64"

function execPath() {
    const execPath = Deno.env.get("SMALLWEB_EXEC_PATH")
    if (!execPath) {
        throw new Error("execPath is not set")
    }

    return execPath
}

export async function open(url: string) {
    const getCommand = () => {
        switch (Deno.build.os) {
            case "darwin":
                return "open"
            default:
                return "xdg-open"
        }
    }

    const command = new Deno.Command(getCommand(), {
        args: [url],
    })

    const { success } = await command.output()
    if (!success) {
        throw new Error("Failed to open URL")
    }

    return
}

export type RequestHandler = (input: RequestInfo | URL, init?: RequestInit) => Response | Promise<Response>
function createHandler(args: string[]): RequestHandler {
    return async (input, init?) => {
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

        const command = new Deno.Command(execPath(), {
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

export const fetchApi: RequestHandler = createHandler(["api"])
export const fetchWebdav: RequestHandler = createHandler(["webdav"])

type App = {
    fetch: (req: Request) => Response | Promise<Response>
}

export function api(): App {
    return {
        fetch: (req: Request) => fetchApi(req),
    }
}

export function webdav(): App {
    return {
        fetch: (req: Request) => fetchWebdav(req),
    }
}