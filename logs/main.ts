import { mergeReadableStreams } from "@std/streams"

export default {
    fetch: (req: Request) => {
        const { SMALLWEB_CLI_PATH, SMALLWEB_ADMIN } = Deno.env.toObject()
        if (!SMALLWEB_ADMIN) {
            return new Response("Not an admin app", {
                status: 500,
                headers: new Headers({
                    "content-type": "text/plain",
                }),
            })
        }

        const url = new URL(req.url)
        const app = url.searchParams.get("app")

        const cmd = new Deno.Command(SMALLWEB_CLI_PATH, {
            args: app ? ["logs"] : ["logs", `--app=${app}`],
            stdout: "piped",
            stderr: "piped",
            signal: req.signal,
        })

        const ps = cmd.spawn()
        const body = mergeReadableStreams(ps.stdout, ps.stderr)
        return new Response(body, {
            status: 200,
            headers: {
                "Content-Type": "text/plain",
                "Transfer-Encoding": "chunked",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Content-Type-Options": "nosniff",
            },
        })
    }
}
