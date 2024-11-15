import * as http from "@std/http";
import * as path from "@std/path";

import { transpile } from "@deno/emit";

import { CSS, render } from "@deno/gfm";
import "prismjs/components/prism-bash.min.js";
import "prismjs/components/prism-javascript.min.js";
import "prismjs/components/prism-typescript.min.js";
import "prismjs/components/prism-css.min.js";
import "prismjs/components/prism-json.min.js";
import "prismjs/components/prism-jsx.min.js";
import "prismjs/components/prism-tsx.min.js";

const cache = await caches.open("file-server");

type FileServerConfig = {
    /**
     * Whether to transpile files with .ts, .jsx, .tsx extensions to javascript.
     * @default false
     */
    transpile?: boolean;
    /**
     * Whether to convert markdown files to html.
     * @default false
     */
    gfm?: boolean;
    /**
     * Whether to cache transpiled files.
     * @default false
     */
    cache?: boolean;
} & http.ServeDirOptions;

export class FileServer {
    constructor(private config: FileServerConfig = {}) { }

    fetch: (req: Request) => Response | Promise<Response> = async (req) => {
        const url = new URL(req.url);
        const resp = await http.serveDir(req, this.config);
        if (!resp.ok) {
            return resp;
        }

        const extension = path.extname(url.pathname);
        if (
            this.config.transpile && [".ts", ".tsx", ".jsx"].includes(extension)
        ) {
            console.error("Transforming", url.href);
            if (this.config.cache) {
                const cached = await cache.match(req);
                if (
                    cached &&
                    cached.headers.get("last-modified") ===
                    resp.headers.get("last-modified")
                ) {
                    return cached;
                }
            }

            const script = await resp.text();
            try {
                let contentType: string;
                switch (extension) {
                    case ".ts":
                        contentType = "text/typescript";
                        break;
                    case ".tsx":
                        contentType = "text/tsx";
                        break;
                    case ".jsx":
                        contentType = "text/jsx";
                        break;
                    default:
                        throw new Error("Invalid extension");
                }

                const result = await transpile(url, {
                    load: (url) => {
                        return Promise.resolve({
                            kind: "module",
                            specifier: url,
                            headers: {
                                "content-type": contentType,
                            },
                            content: script,
                        });
                    },
                });
                const code = result.get(url.href);

                const res = new Response(code, {
                    headers: {
                        "Content-Type": "text/javascript",
                        "last-modified": resp.headers.get("last-modified") ||
                            "",
                    },
                    status: resp.status,
                });

                if (this.config.enableCors) {
                    res.headers.set("Access-Control-Allow-Origin", "*");
                }

                if (this.config.cache) {
                    await cache.put(req, res.clone());
                }

                return res;
            } catch (e) {
                console.error("Error transforming", e);
                return new Response(script, {
                    status: 500,
                    headers: {
                        "Content-Type": "text/javascript",
                    },
                });
            }
        }

        if (this.config.gfm && extension === ".md") {
            if (this.config.cache) {
                const cached = await cache.match(req);
                if (
                    cached &&
                    cached.headers.get("last-modified") ===
                    resp.headers.get("last-modified")
                ) {
                    return cached;
                }
            }

            let markdown = await resp.text();
            const match = markdown.match(FRONTMATTER_REGEX);
            if (match) {
                markdown = markdown.slice(match[0].length);
            }

            const body = md2html(url.pathname, markdown);
            const res = new Response(body, {
                headers: {
                    "Content-Type": "text/html; charset=utf-8",
                    "last-modified": resp.headers.get("last-modified") || "",
                },
            });

            if (this.config.enableCors) {
                res.headers.set("Access-Control-Allow-Origin", "*");
            }

            if (this.config.cache) {
                await cache.put(req, res.clone());
            }
            return res;
        }

        return resp;
    };
}

const FRONTMATTER_REGEX = /^---\n[\s\S]+?\n---\n/;

const md2html = (title: string, markdown: string) =>
    /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
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
  ${render(markdown)}
</main>
</body>
</html>
`;

const fileServer: FileServer = new FileServer({
    transpile: true,
    gfm: true,
    showDirListing: true,
    enableCors: true,
    quiet: true,
    cache: true,
});

export default fileServer;
