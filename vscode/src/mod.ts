import { Hono } from "hono";
import homepage from "./homepage.ts";

export class VSCode {
    private server;
    constructor() {
        this.server = new Hono().get("/", (c) => {
            return c.html(homepage);
        }).get("/product.json", (c) => {
            return c.json({
                "productConfiguration": {
                    "nameShort": "VSCode Web Sample",
                    "nameLong": "VSCode Web without FileSystemProvider",
                    "applicationName": "code-web-sample",
                    "dataFolderName": ".vscode-web-sample",
                    "version": "1.75.0",
                    "extensionsGallery": {
                        "serviceUrl": "https://open-vsx.org/vscode/gallery",
                        "itemUrl": "https://open-vsx.org/vscode/item",
                        "resourceUrlTemplate":
                            "https://openvsxorg.blob.core.windows.net/resources/{publisher}/{name}/{version}/{path}",
                    },
                    "extensionEnabledApiProposals": {
                        "vscode.vscode-web-playground": [
                            "fileSearchProvider",
                            "textSearchProvider",
                        ],
                    },
                },
            });
        });
    }

    fetch = (req: Request): Response | Promise<Response> => {
        return this.server.fetch(req);
    };
}
