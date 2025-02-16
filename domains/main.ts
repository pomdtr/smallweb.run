import * as fs from "jsr:@std/fs@1.0.13";
import * as path from "jsr:@std/path@1.0.8";

export default {
    async fetch(req: Request) {
        const { SMALLWEB_DOMAIN, SMALLWEB_DIR } = Deno.env.toObject();

        const url = new URL(req.url);
        const domain = url.searchParams.get("domain");
        if (!domain) {
            return new Response("Missing domain", { status: 400 });
        }

        const entries = await Array.fromAsync(Deno.readDir(SMALLWEB_DIR));

        const apps = await entries.filter((entry) =>
            entry.isDirectory && !entry.name.startsWith(".")
        ).map((entry) => entry.name);

        if (domain === SMALLWEB_DOMAIN) {
            return apps.includes("www")
                ? new Response("OK")
                : new Response("Not Found", { status: 404 });
        }

        const configPath = path.join(SMALLWEB_DIR, ".smallweb", "config.json");
        const configText = await fs.exists(configPath)
            ? await Deno.readTextFile(configPath)
            : "{}";
        const { customDomains = {} } = JSON.parse(configText) as {
            customDomains?: Record<string, string>;
        };

        if (domain in customDomains) {
            return new Response("OK");
        }

        const [subdomain, ...parts] = domain.split(".");
        const baseDomain = parts.join(".");
        if (baseDomain === SMALLWEB_DOMAIN && apps.includes(subdomain)) {
            return new Response("OK");
        }

        if (customDomains[baseDomain] === "*" && apps.includes(subdomain)) {
            return new Response("OK");
        }

        return new Response("Not Found", { status: 404 });
    },
};
