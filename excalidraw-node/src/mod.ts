import * as path from "node:path";
import { createServer } from "./server.ts";
import process from "node:process"

export type ExcalidrawOptions = {
    rootDir?: string;
}

export class Excalidraw {
    private server

    constructor(options: ExcalidrawOptions = {}) {
        this.server = createServer(options.rootDir || path.join(process.cwd(), "data"))
    }

    fetch: (req: Request) => Response | Promise<Response> = (req) => this.server.fetch(req)
}
