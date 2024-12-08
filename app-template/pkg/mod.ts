
export type HelloWorldConfig = {
    name?: string;
};

export class ExampleApp {
    name: string;

    constructor(config: HelloWorldConfig = {}) {
        const { name = "smallweb" } = config;
        this.name = name;
    }

    fetch: (req: Request) => Response | Promise<Response> = (_req) => {
        return new Response(`Hello, ${this.name}!`);
    };

    run: (args: string[]) => void | Promise<void> = (_args) => {
        console.log(`Hello, ${this.name}!`);
    };
}
