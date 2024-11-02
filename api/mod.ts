import { Hono } from "hono";
import { z } from 'zod';
import { extendZodWithOpenApi } from 'hono-zod-openapi';
import { createOpenApiDocument, openApi } from 'hono-zod-openapi';


extendZodWithOpenApi(z);

export type ApiOptions = {
    rootDir?: string;
}

function fetchApi(req: Request, options: ApiOptions = {}): Response | Promise<Response> {
    const {
        rootDir = Deno.env.get("SMALLWEB_DIR"),
    } = options;

    if (!rootDir) {
        throw new Error("SMALLWEB_DIR is not set");
    }

    const app = new Hono();
    app.get("/v0/apps")
    app.get("/v0/apps/{app}")

    createOpenApiDocument(app, {
        info: {
            title: "Smallweb API",
            version: "0"
        }
    })
    return app.fetch(req);
}

type App = {
    fetch: (req: Request) => Response | Promise<Response>
}

export function api(options: ApiOptions = {}): App {
    return {
        fetch: (req: Request) => fetchApi(req, options)
    }
}
