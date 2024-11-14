import { Hono } from "hono";
import { createApi } from "./api.ts";
import embeds from "./dist/mod.ts";
import { escape } from "@std/html";
import { createOpenApiDocument } from "hono-zod-openapi";
import * as path from "@std/path";

export function createServer(params: {
    rootDir: string;
    token: string | string[];
}) {
    const api = createApi({
        rootDir: params.rootDir,
        token: params.token,
    });
    return new Hono()
        .route("/api", api)
        .get("/openapi.json", (c) => {
            const doc = createOpenApiDocument(api, {
                info: {
                    title: "VS Code API",
                    version: "1.0.0",
                },
            }, {
                addRoute: false,
            });

            return c.json(doc);
        })
        .get("/openapi.ts", (c) => {
            const doc = createOpenApiDocument(api, {
                info: {
                    title: "VS Code API",
                    version: "1.0.0",
                },
            }, {
                addRoute: false,
            });

            return c.text(
                `export default ${JSON.stringify(doc, null, 4)} as const;`,
                {},
            );
        })
        .get("manifest.json", (c) => {
            return embeds.serve(c.req.raw);
        })
        .get("*", async (c) => {
            const url = new URL(c.req.url);
            const target = path.resolve(
                path.join(params.rootDir, url.pathname),
            );
            if (!target.startsWith(params.rootDir)) {
                return new Response("Not found", { status: 404 });
            }

            const stat = await Deno.stat(target).catch(() => null);
            if (!stat || !stat.isDirectory) {
                return new Response("Not found", { status: 404 });
            }

            const homepage = await embeds.load("index.html").then((embed) =>
                embed.text()
            );

            return new Response(
                homepage.replace(
                    "{{VSCODE_WORKBENCH_WEB_CONFIGURATION}}",
                    escape(
                        JSON.stringify(workbenchConfig(url.host, {
                            path: c.req.path,
                        })),
                    ),
                ),
                {
                    headers: {
                        "Content-Type": "text/html; charset=utf-8",
                    },
                },
            );
        });
}

function workbenchConfig(host: string, options: {
    token?: string;
    path?: string;
} = {}) {
    return {
        "productConfiguration": {
            "nameShort": "Smallweb Editor",
            "nameLong": "Smallweb Editor",
            "applicationName": "code-web-sample",
            "dataFolderName": ".vscode-web-sample",
            "version": "1.95.2",
            "extensionsGallery": {
                "serviceUrl": "https://open-vsx.org/vscode/gallery",
                "itemUrl": "https://open-vsx.org/vscode/item",
                "resourceUrlTemplate":
                    "https://openvsxorg.blob.core.windows.net/resources/{publisher}/{name}/{version}/{path}",
            },
            "extensionEnabledApiProposals": {
                "pomdtr.smallweb": [
                    "fileSearchProviderNew",
                    "textSearchProviderNew",
                ],
            },
        },
        "folderUri": {
            "scheme": "smallweb",
            "authority": host,
            "path": options.path ?? "/",
        },
        "additionalBuiltinExtensions": [
            {
                "scheme": "https",
                "authority": "raw.esm.sh",
                "path": "smallweb-vscode@0.0.4",
            },
        ],
    };
}
