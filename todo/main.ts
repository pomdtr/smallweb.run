import { CSS, render } from "jsr:@deno/gfm";

import "npm:prismjs@1.29.0/components/prism-bash.js";
import "npm:prismjs@1.29.0/components/prism-typescript.js";
import "npm:prismjs@1.29.0/components/prism-json.js";

const editorURL = "https://editor.smallweb.run/todo/TODO.md";

export default {
  fetch: (req) => {
    const url = new URL(req.url);
    if (url.pathname === "/edit") {
      return Response.redirect(editorURL);
    }

    const markdown = Deno.readTextFileSync("TODO.md");
    const body = render(markdown);
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
    <script type="module" src="https://esm.smallweb.run/dot-shortcut.ts?url=${editorURL}"></script>
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
  },
} satisfies Deno.ServeDefaultExport;
