import { CSS, render } from "jsr:@deno/gfm";
import * as path from "jsr:@std/path"

import "npm:prismjs@1.29.0/components/prism-bash.js";
import "npm:prismjs@1.29.0/components/prism-typescript.js";
import "npm:prismjs@1.29.0/components/prism-json.js";

type ReadmeOptions = {
  apiUrl?: string;
  apiToken?: string;
}

type App = {
  fetch: (req: Request) => Promise<Response>
}

export function readme(options?: ReadmeOptions): App {
  const apiUrl = options?.apiUrl || Deno.env.get("SMALLWEB_API_URL")
  if (!apiUrl) {
    throw new Error("No API URL provided")
  }

  const apiToken = options?.apiToken || Deno.env.get("SMALLWEB_API_TOKEN")

  const fetchApi = (path: string, options: RequestInit) => {
    const headers = new Headers(options.headers);
    if (apiToken) {
      headers.set("Authorization", `Bearer ${apiToken}`);
    }

    return fetch(new URL(path, apiUrl), { ...options, headers });
  }

  return {
    async fetch(req) {
      const url = new URL(req.url);
      if (req.method != "GET") {
        return new Response("Method not allowed", { status: 405 });
      }

      const resp = await fetchApi(path.join("/webdav", url.pathname), {
        method: "GET",
      });

      if (!resp.ok) {
        return new Response("File not found", { status: 404 });
      }

      const body = render(await resp.text());

      const html = /* html */ `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smallweb TODO</title>
    <link rel="icon" href="https://icons.smallweb.run/smallweb.svg" type="image/svg+xml" />
    <style>
      main {
        max-width: 800px;
        margin: 0 auto;
      }
      ${CSS}
    </style>
    <script type="module" src=""></script>
    </head>
    <body data-color-mode="auto" data-light-theme="light" data-dark-theme="dark" class="markdown-body">
    <main>
      ${body}
    </main>
    </body>
    </html>
    `;
      return new Response(html, {
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      });
    }
  }
}
