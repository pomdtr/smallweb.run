import { serveFile } from "jsr:@std/http@1.0.12/file-server"
import vento from "jsr:@vento/vento@1.12.10";

function fetchLatestRelease() {
    const url = new URL("https://api.github.com/repos/pomdtr/smallweb/releases/latest");
    return fetch(url, {
        headers: {
            Authorization: `Bearer ${Deno.env.get("GITHUB_TOKEN")}`,
        },
    });
}


export default {
    async fetch(req: Request) {
        const url = new URL(req.url);
        if (url.pathname === "/vps.sh") {
            const res = await serveFile(req, "./vps.sh");
            res.headers.set("Content-Type", "text/plain; charset=utf-8");
            return res;
        }

        let version: string
        if (url.searchParams.get("version")) {
            version = url.searchParams.get("version")!;
        } else if (url.searchParams.has("v")) {
            version = url.searchParams.get("v")!;
        } else {
            const resp = await fetchLatestRelease();
            if (!resp.ok) {
                return new Response("Failed to fetch latest release", { status: resp.status });
            }

            const release = await resp.json();
            version = release.tag_name.slice(1);
        }

        if (version.startsWith("v")) {
            version = version.slice(1);
        }

        const env = vento();
        const script = await env.run("install.sh", { version, target_dir: url.searchParams.get("target_dir") });
        return new Response(script.content, {
            headers: { "Content-Type": "text/plain" },
        });
    },
};
