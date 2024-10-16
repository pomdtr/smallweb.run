import * as path from "jsr:@std/path@1.0.6"

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

export function codeshots(): (req: Request) => Promise<Response> {
    return async (req) => {
        const url = new URL(req.url);
        if (url.pathname == "/favicon.ico") {
            return new Response("Not found", { status: 404 });
        }


        const targetURL = new URL("/webdav" + url.pathname, Deno.env.get("SMALLWEB_API_URL"));
        const resp = await fetch(targetURL, {
            headers: {
                "Authorization": `Bearer ${Deno.env.get("SMALLWEB_API_TOKEN")}`,
            }
        })

        if (!resp.ok) {
            return new Response("File not found", { status: 404 });
        }

        const code = await resp.text();
        const language = url.searchParams.get("language") || ext2lang[path.extname(url.pathname)] || "text";
        if (!language) {
            return new Response("Language not supported", { status: 400 });
        }

        const image = await fetchImage(code, { language, theme: "github-light" });
        return new Response(image, {
            headers: { "Content-Type": "image/png" },
        });
    }
}
