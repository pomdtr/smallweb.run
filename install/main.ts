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
        let version = url.searchParams.get("version") || url.searchParams.get("v")
        if (!version) {
            const resp = await fetchLatestRelease();
            if (!resp.ok) {
                return new Response("Failed to fetch latest release", { status: resp.status });
            }

            const release = await resp.json();
            version = release.tag_name.slice(1);
        }

        const target_dir = url.searchParams.get("target_dir") ||
            "${XDG_BIN_HOME:-$HOME/.local/bin}";
        const env = vento();
        const script = await env.run("install.sh", { version, target_dir });
        return new Response(script.content, {
            headers: { "Content-Type": "text/plain" },
        });
    },
};
