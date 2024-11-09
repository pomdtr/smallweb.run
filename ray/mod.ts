import * as path from "jsr:@std/path@1.0.6";
import * as http from "@std/http";
import { encodeBase64Url } from "jsr:@std/encoding@1.0.5/base64url";

const ext2lang: Record<string, string> = {
    ".js": "javascript",
    ".ts": "typescript",
    ".astro": "astro",
    ".jsx": "jsx",
    ".tsx": "tsx",
    ".md": "markdown",
    ".html": "html",
    ".css": "css",
    ".json": "json",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".toml": "toml",
    ".sh": "shell",
};

function getRayUrl(pathname: string, code: string): string {
    const title = path.basename(pathname);
    const language = ext2lang[path.extname(pathname)] || "";
    const hash = `#title=${title}&code=${
        encodeBase64Url(code)
    }&language=${language}`;
    return `https://ray.so${hash}`;
}

type App = {
    fetch: (req: Request) => Promise<Response>;
    run: (args: string[]) => Promise<void>;
};

export function ray(rootDir: string): App {
    return {
        fetch: async (req) => {
            const url = new URL(req.url);
            const filepath = path.join(rootDir, url.pathname);

            const stat = await Deno.stat(filepath).catch(() => null);
            if (!stat) {
                return new Response("File not found", { status: 404 });
            }

            if (stat.isDirectory) {
                return http.serveDir(req, {
                    fsRoot: rootDir,
                    showDirListing: true,
                    showIndex: false,
                    showDotfiles: true,
                });
            }

            if (url.pathname == "/favicon.ico") {
                return new Response("Not found", { status: 404 });
            }

            const code = await Deno.readTextFile(filepath);
            const rayURL = getRayUrl(url.pathname, code);
            return Response.redirect(rayURL);
        },
        run: async (args) => {
            if (args.length === 0) {
                console.error("No file provided");
                Deno.exit(1);
            }

            const resp = await fetch(path.join("/webdav", args[0]));
            if (!resp.ok) {
                console.error("Error fetching file", await resp.text());
                Deno.exit(1);
            }

            const rayURL = getRayUrl(args[0], await resp.text());
            if (!Deno.stdout.isTerminal()) {
                Deno.stdout.write(new TextEncoder().encode(rayURL));
                return;
            }

            console.log(rayURL);
        },
    };
}
