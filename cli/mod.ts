import stripAnsi from 'strip-ansi'

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

        const command = new Deno.Command(SMALLWEB_CLI_PATH, {
            args
        })
        const res = await command.output()
        const text = new TextDecoder().decode(res.code === 0 ? res.stdout : res.stderr)
        return new Response(stripAnsi(text), {
            status: res.code === 0 ? 200 : 500,
            headers: new Headers({
                "content-type": "text/plain",
            }),
        })
    }
}
