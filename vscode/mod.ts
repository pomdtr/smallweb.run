import { escape } from "jsr:@std/html";
import embeds from "./dist/mod.ts";

export type VSCodeConfig = {
    workbench?: Record<string, unknown>;
};

export class VSCode {
    constructor(private config: VSCodeConfig = {}) {}

    fetch: (req: Request) => Response | Promise<Response> = async (
        req: Request,
    ) => {
        const url = new URL(req.url);
        if (url.pathname !== "/") {
            return new Response("Not found", { status: 404 });
        }

        const embed = await embeds.load("index.html");
        const content = await embed.text();

        return new Response(
            content.replace(
                "{{VSCODE_WORKBENCH_WEB_CONFIGURATION}}",
                escape(
                    JSON.stringify(this.config.workbench || workbenchConfig),
                ),
            ),
            {
                headers: {
                    "Content-Type": "text/html; charset=utf-8",
                },
            },
        );
    };
}

export const workbenchConfig = {
    productConfiguration: {
        nameShort: "Smallweb Editor",
        nameLong: "Smallweb Editor",
        applicationName: "code-web-sample",
        dataFolderName: ".vscode-web-sample",
        version: "1.95.2",
        extensionsGallery: {
            serviceUrl: "https://open-vsx.org/vscode/gallery",
            itemUrl: "https://open-vsx.org/vscode/item",
            resourceUrlTemplate:
                "https://openvsxorg.blob.core.windows.net/resources/{publisher}/{name}/{version}/{path}",
        },
        // extensionEnabledApiProposals: {
        //     "pomdtr.smallweb": ["fileSearchProvider", "textSearchProvider", "ipc"]
        // }
    },
    // folderUri: { scheme: "smallweb", path: "/" },
    // additionalBuiltinExtensions: [{
    //     scheme: window.location.protocol === "http:" ? "http" : "https",
    //     authority: window.location.host,
    // }]
};
