import * as path from "jsr:@std/path@1.0.6"
import type { App as SmallwebApp } from "jsr:@smallweb/types@0.1.0"
import { encodeBase64Url } from "jsr:@std/encoding@1.0.5/base64url"

export type CodeShotOptions = {
    apiUrl?: string;
    apiToken?: string;
    theme?: string;
    padding?: number;
    darkMode?: boolean;
    background?: boolean;
}

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
}

function getRayUrl(pathname: string, code: string): string {
    const title = path.basename(pathname);
    const language = ext2lang[path.extname(pathname)] || "";
    const hash = `#title=${title}&code=${encodeBase64Url(code)}&language=${language}`;
    return `https://ray.so${hash}`;
}

export function ray(options: CodeShotOptions = {}): SmallwebApp {
    const apiURL = options.apiUrl || Deno.env.get("SMALLWEB_API_URL");
    if (!apiURL) {
        throw new Error("No API URL provided");
    }

    const apiToken = options.apiToken || Deno.env.get("SMALLWEB_API_TOKEN");
    if (!apiToken) {
        throw new Error("No API Token provided");
    }

    return {
        fetch: async (req) => {
            const url = new URL(req.url);
            if (url.pathname == "/favicon.ico") {
                return new Response("Not found", { status: 404 });
            }
            const targetURL = new URL("/webdav" + url.pathname, apiURL);
            const resp = await fetch(targetURL, {
                headers: {
                    "Authorization": `Bearer ${apiToken}`,
                }
            })

            if (!resp.ok) {
                return new Response("File not found", { status: 404 });
            }

            const rayURL = getRayUrl(url.pathname, await resp.text());
            return Response.redirect(rayURL);
        },
        run: async (args) => {
            if (args.length === 0) {
                console.error("No file provided");
                Deno.exit(1);
            }

            const targetURL = new URL(path.join("webdav", args[0]), apiURL);
            const resp = await fetch(targetURL, {
                headers: {
                    "Authorization": `Bearer ${apiToken}`,
                }
            })

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
        }
    }
}
