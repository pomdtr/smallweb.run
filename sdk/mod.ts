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

const swaggerHomepage = (assetsRoot: string) => /* html */ `<!DOCTYPE html>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Swagger UI</title>
    <link rel="stylesheet" type="text/css" href="${assetsRoot}/swagger-ui.css" />
    <link rel="stylesheet" type="text/css" href="${assetsRoot}/index.css" />
    <link rel="icon" type="image/png" href="${assetsRoot}/favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="${assetsRoot}/favicon-16x16.png" sizes="16x16" />
    <style>
      /* Hide the top black bar */
      .swagger-ui .topbar {
        display: none;
      }
  </style>
  </head>

  <body>
    <div id="swagger-ui"></div>
    <script src="${assetsRoot}/swagger-ui-bundle.js" charset="UTF-8"> </script>
    <script src="${assetsRoot}/swagger-ui-standalone-preset.js" charset="UTF-8"> </script>
    <script src="${assetsRoot}/swagger-initializer.js" charset="UTF-8"> </script>
    <script>
    window.onload = () => {
      const ui = SwaggerUIBundle({
        url: "/openapi.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout"
      });

      window.ui = ui;
    };
  </script>
  </body>
</html>
`

export type ApiOptions = {
    assetsRoot?: string
}

export function api(opts: ApiOptions = {}): App {
    const {
        assetsRoot = "https://raw.esm.sh/swagger-ui-dist@5.17.14",
    } = opts

    return {
        fetch: (req: Request) => {
            const url = new URL(req.url)
            if (url.pathname == "/") {
                return new Response(swaggerHomepage(assetsRoot.endsWith("/") ? assetsRoot.slice(0, -1) : assetsRoot), {
                    headers: {
                        "content-type": "text/html; charset=utf-8",
                    },
                })
            }

            return fetchApi(req)
        }
    }
}

export function webdav(): App {
    return {
        fetch: (req: Request) => fetchWebdav(req),
    }
}
