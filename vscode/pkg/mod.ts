import { createServer } from "./server.ts";
import * as path from "@std/path";

export type VSCodeConfig = {
    rootDir?: string;
    token?: string | string[];
};

export class VSCode {
    private server;
    constructor(public config: VSCodeConfig = {}) {
        const { rootDir = ".", token = Deno.env.get("VSCODE_TOKEN") } = config;
        if (!token) {
            throw new Error("VSCODE_TOKEN is required");
        }

        this.server = createServer({
            rootDir: path.resolve(rootDir),
            token,
        });
    }

    fetch: (req: Request) => Response | Promise<Response> = (req) => {
        return this.server.fetch(req);
    };
}
