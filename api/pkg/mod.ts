import { createCommand } from "./cli.ts";
import { createServer } from "./server.ts";

export type SmallwebApiConfig = {
    dir?: string;
    domain?: string;
    publicRoutes?: string[];
    verifyToken?: (token: string) => boolean | Promise<boolean>;
};

export class SmallwebApi {
    private server;
    private command;
    private publicRoutes: string[];
    private verifyToken: (token: string) => boolean | Promise<boolean>;

    constructor(config: SmallwebApiConfig = {}) {
        const {
            dir = Deno.env.get("SMALLWEB_DIR"),
            domain = Deno.env.get("SMALLWEB_DOMAIN"),
            publicRoutes = ["/", "/openapi.json"],
            verifyToken = (token) => {
                if (!Deno.env.has("SMALLWEB_API_TOKEN")) {
                    return false;
                }

                return token == Deno.env.get("SMALLWEB_API_TOKEN");
            },
        } = config;

        if (!dir) {
            throw new Error("dir is required");
        }

        if (!domain) {
            throw new Error("domain is required");
        }

        this.publicRoutes = publicRoutes;
        this.verifyToken = verifyToken;
        this.server = createServer({ dir, domain });
        this.command = createCommand({
            name: Deno.env.get("SMALLWEB_APP_NAME") || "smallweb",
            fetchApi: this.server.request,
        });
    }

    private verifyRequest(req: Request) {
        const authorization = req.headers.get("authorization");
        if (!authorization) {
            return false;
        }

        if (!authorization.startsWith("Bearer ")) {
            return false;
        }

        const token = authorization.slice(7);
        return this.verifyToken(token);
    }

    fetch: (req: Request) => Response | Promise<Response> = async (req) => {
        const url = new URL(req.url);
        if (this.publicRoutes.includes(url.pathname)) {
            return this.server.fetch(req);
        }

        if (!await this.verifyRequest(req)) {
            return new Response("Unauthorized", { status: 401 });
        }

        return this.server.fetch(req);
    };

    run: (args: string[]) => void | Promise<void> = async (args) => {
        await this.command.parse(args);
    };
}
