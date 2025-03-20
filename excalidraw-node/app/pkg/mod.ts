import * as path from "node:path";
import { createServer } from "./server.ts";
import process from "node:process"
import { createCli } from "./cli.ts";

export type ExcalidrawOptions = {
    rootDir?: string;
}

export class Excalidraw {
    private server
    private cli

    constructor(options: ExcalidrawOptions = {}) {
        this.server = createServer(options.rootDir || path.join(process.cwd(), "data"))
        this.cli = createCli(options.rootDir || path.join(process.cwd(), "data"))
    }

    fetch: (req: Request) => Response | Promise<Response> = (req) => this.server.fetch(req)
    run: (args: string[]) => Promise<void> = async (args) => {
        this.cli.parse(args, { from: "user" })
    }
}
