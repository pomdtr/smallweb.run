import { Hono } from "hono";
import { z } from 'zod';
import { extendZodWithOpenApi } from 'hono-zod-openapi';

extendZodWithOpenApi(z);

export type ApiOptions = {
    rootDir?: string;
}

function fetchApi(input: URL | Request | string, init?: RequestInit & ApiOptions): Response | Promise<Response> {
    const app = new Hono();
    app.get("/v0/apps")
    app.get("/v0/apps/{app}")

    const req = new Request(input, init);
    return app.fetch(req);
}

type App = {
    fetch: (req: Request) => Response | Promise<Response>
}

export function api(options: ApiOptions = {}): App {
    return {
        fetch: (req: Request) => fetchApi(req.url, {
            ...req,
            ...options
        })
    }
}




