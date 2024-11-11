import { createServer } from "./server.ts";

export class VSCode {
    private server;
    constructor() {
        this.server = createServer();
    }

    fetch: (req: Request) => Response | Promise<Response> = (req) => {
        return this.server.fetch(req);
    };
}
