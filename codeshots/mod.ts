import * as path from "jsr:@std/path@1.0.6"
import * as fs from "jsr:@std/fs@1.0.4"

async function fetchImage(code: string, settings: {
    language: string;
    theme: string;
}) {
    const response = await fetch('https://sourcecodeshots.com/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            code, settings: {
                language: settings.language,
                theme: settings.theme,
            }
        }),
    });

    return await response.blob();
}

const cache = await caches.open("sourcecodeshots");

const ext2lang: Record<string, string> = {
    ".ts": "typescript",
    ".jsx": "jsx",
    ".tsx": "tsx",
    ".js": "javascript",
    ".py": "python",
    ".css": "css",
    ".sh": "shellscript",
    ".bash": "shellscript",
    ".html": "html",
    ".sql": "sql",
    ".json": "json",
}

export function codeshots(rootDir: string): (req: Request) => Promise<Response> {
    return async (req) => {
        const url = new URL(req.url);
        if (url.pathname == "/favicon.ico") {
            return new Response("Not found", { status: 404 });
        }
        if (url.pathname == "/") {
            const entries = Array.from(Deno.readDirSync(rootDir));
            return Response.json(entries.map(entry => ({ name: entry.name, url: new URL(entry.name, url).href })));
        }

        const snippet = path.join(Deno.cwd(), rootDir, url.pathname);
        if (!fs.existsSync(snippet)) {
            return new Response("Not found", { status: 404 });
        }

        const mtime = Deno.statSync(snippet).mtime!

        const cached = await cache.match(req);
        if (cached) {
            const lastModified = cached.headers.get("Last-Modified");
            if (lastModified === mtime.toUTCString()) {
                return cached;
            }

            await cache.delete(req);
        }

        const code = await Deno.readTextFile(snippet);
        const language = ext2lang[path.extname(snippet)];
        if (!language) {
            return new Response("Language not supported", { status: 400 });
        }

        const image = await fetchImage(code, { language, theme: "github-light" });
        const resp = new Response(image, {
            headers: { "Content-Type": "image/png", "Last-Modified": mtime.toUTCString() },
        });

        await cache.put(req, resp.clone());
        return resp;
    }
}
