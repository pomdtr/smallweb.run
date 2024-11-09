import { CSS, render } from "jsr:@deno/gfm";
import * as path from "jsr:@std/path";
import * as http from "jsr:@std/http";
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-json.js";

type ReadmeOptions = {
  editorUrl?: string;
};

export class Readme {
  constructor(public options: ReadmeOptions = {}) {}

  fetch = async (req: Request) => {
    const { editorUrl } = this.options;
    const rootDir = Deno.env.get("SMALLWEB_DIR");
    if (!rootDir) {
      throw new Error(
        "SMALLWEB_DIR is not set; are you sure you're app has admin permissions?",
      );
    }

    const url = new URL(req.url);
    if (url.pathname === "/") {
      return http.serveDir(req, {
        fsRoot: rootDir,
        showDirListing: true,
        showIndex: false,
      });
    }

    if (req.method != "GET") {
      return new Response("Method not allowed", { status: 405 });
    }

    if (editorUrl && url.searchParams.has("edit")) {
      const target = new URL(path.join(url.pathname, "README.md"), editorUrl);
      return Response.redirect(target);
    }

    const markdown = await Deno.readTextFile(
      path.join(rootDir, url.pathname, "README.md"),
    );
    const body = render(await markdown);
    const html = /* html */ `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smallweb TODO</title>
    ${
      this.options.editorUrl
        ? /* html */ `<script type="module" src="https://esm.smallweb.run/dot-shortcut.ts?url=${new URL(
          path.join(url.pathname, "README.md"),
          this.options.editorUrl,
        )}"></script>`
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
  };
}
