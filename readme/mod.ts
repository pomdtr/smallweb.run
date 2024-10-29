import { CSS, render } from "jsr:@deno/gfm";
import * as path from "jsr:@std/path"
import { fetchApi } from "jsr:@smallweb/api@0.1.1"

import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-json.js";

type ReadmeOptions = {
  editorUrl?: string;
}

type App = {
  fetch: (req: Request) => Promise<Response>
}

export function readme(opts: ReadmeOptions = {}): App {
  const { editorUrl } = opts

  return {
    async fetch(req) {
      const url = new URL(req.url);
      if (req.method != "GET") {
        return new Response("Method not allowed", { status: 405 });
      }

      if (editorUrl && url.searchParams.has("edit")) {
        const target = new URL(path.join(url.pathname, "README.md"), editorUrl)
        return Response.redirect(target)
      }

      const resp = await fetchApi(path.join("/webdav", url.pathname, "README.md"), {
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
    ${opts?.editorUrl ?
      /* html */ `<script type="module" src="https://esm.smallweb.run/dot-shortcut.ts?url=${new URL(path.join(url.pathname, "README.md"), opts.editorUrl)}"></script>`
          : ""
        }
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
