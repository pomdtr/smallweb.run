import { createCli } from "./cli.ts";
import { createServer } from "./server.ts";

export type HelloWorldConfig = {
    name?: string;
};

export class HelloWorld {
    private server;
    private cli;

    constructor(config: HelloWorldConfig = {}) {
        const { name = "smallweb" } = config;

        this.server = createServer({ name });
        this.cli = createCli({ name });
    }

    fetch: (req: Request) => Response | Promise<Response> = (req) => {
        return this.server.fetch(req);
    };

    run: (args: string[]) => void | Promise<void> = async (args) => {
        await this.cli.parse(args);
    };
}
