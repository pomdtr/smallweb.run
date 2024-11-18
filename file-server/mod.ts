import * as http from "@std/http";
import * as path from "@std/path/posix";
import * as fs from "@std/fs";

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

type FileServerOptions = {
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
    constructor(private options: FileServerOptions = {}) { }

    fetch: (req: Request) => Response | Promise<Response> = async (req) => {
        const url = new URL(req.url);
        const fileinfo = await Deno.stat(path.join(this.options.fsRoot || ".", url.pathname))

        if (
            this.options.showIndex
            && this.options.gfm
            && fileinfo.isDirectory
            && !await fs.exists(path.join(this.options.fsRoot || ".", url.pathname, "index.html"))
            && await fs.exists(path.join(this.options.fsRoot || ".", url.pathname, "index.md"))
        ) {
            return this.serveMarkdown(req);
        }

        const extension = path.extname(url.pathname);
        if (
            this.options.transpile && [".ts", ".tsx", ".jsx"].includes(extension)
        ) {
            return this.serveTranspiled(req);
        }

        if (this.options.gfm && extension === ".md") {
            return this.serveMarkdown(req);
        }

        return http.serveDir(req, this.options);
    };


    private serveTranspiled = async (req: Request) => {
        const url = new URL(req.url);
        const filepath = path.join(this.options.fsRoot || ".", url.pathname);
        const fileinfo = await Deno.stat(filepath)
            .catch(() => null);
        if (!fileinfo) {
            return new Response("Not found", { status: 404 });
        }

        if (fileinfo.isDirectory) {
            return http.serveDir(req, this.options);
        }

        if (this.options.cache) {
            const cached = await cache.match(req);
            if (
                cached &&
                cached.headers.get("last-modified") ===
                fileinfo.mtime?.toUTCString()
            ) {
                return cached;
            }
        }

        const script = await Deno.readTextFile(filepath);
        try {
            let contentType: string;
            switch (path.extname(url.pathname)) {
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
                    "last-modified": fileinfo.mtime?.toUTCString() || "",
                },
                status: 200,
            });

            if (this.options.enableCors) {
                res.headers.set("Access-Control-Allow-Origin", "*");
            }

            if (this.options.cache) {
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

    private serveMarkdown = async (req: Request): Promise<Response> => {
        const url = new URL(req.url);

        const filepath = path.join(this.options.fsRoot || ".", url.pathname);
        const fileinfo = await Deno.stat(filepath)
            .catch(() => null);



        if (!fileinfo) {
            return new Response("Not found", { status: 404 });
        }

        if (fileinfo.isDirectory) {
            const index = path.join(this.options.fsRoot || ".", url.pathname, "index.md");
            if (!await fs.exists(index)) {
                return http.serveDir(req, this.options);
            }

            return this.serveMarkdown(new Request(`${url.origin}${path.join(url.pathname, "index.md")}`));
        }



        if (this.options.cache) {
            const cached = await cache.match(req);
            if (
                cached &&
                cached.headers.get("last-modified") ===
                fileinfo.mtime?.toUTCString()
            ) {
                return cached;
            }
        }

        let markdown = await Deno.readTextFile(filepath);
        const match = markdown.match(FRONTMATTER_REGEX);
        if (match) {
            markdown = markdown.slice(match[0].length);
        }

        const body = md2html(url.pathname, markdown);
        const res = new Response(body, {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "last-modified": fileinfo.mtime?.toUTCString() || "",
            },
        });

        if (this.options.enableCors) {
            res.headers.set("Access-Control-Allow-Origin", "*");
        }

        if (this.options.cache) {
            await cache.put(req, res.clone());
        }
        return res;
    }
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
    showIndex: true,
    showDirListing: true,
    enableCors: true,
    quiet: true,
    cache: true,
});

export default fileServer;
