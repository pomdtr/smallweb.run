import * as path from "@std/path";
import { createServer } from "./server.ts";

export type ExcalidrawOptions = {
    rootDir?: string;
}

export class Excalidraw {
    private server

    constructor(options: ExcalidrawOptions = {}) {
        this.server = createServer(options.rootDir || path.join(Deno.cwd(), "data"))
    }

    fetch: (req: Request) => Response | Promise<Response> = (req) => this.server.fetch(req)
}

