import vento from "jsr:@vento/vento@1.12.10";

async function fetchLatestVersion() {
    const resp = await fetch("https://api.smallweb.run/v1/versions/latest");
    if (!resp.ok) {
        throw new Error("could not fetch latest version");
    }
    return resp.text();
}

export default {
    async fetch(req: Request) {
        const url = new URL(req.url);
        const version = url.searchParams.get("version") ||
            url.searchParams.get("v") ||
            await fetchLatestVersion();
        const target_dir = url.searchParams.get("target_dir") ||
            "${XDG_BIN_HOME:-$HOME/.local/bin}";
        const env = vento();
        const script = await env.run("install.sh", { version, target_dir });
        return new Response(script.content, {
            headers: { "Content-Type": "text/plain" },
        });
    },
};
