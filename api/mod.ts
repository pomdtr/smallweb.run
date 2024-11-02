import { Hono } from "hono";
import { z } from 'zod';
import { extendZodWithOpenApi } from 'hono-zod-openapi';

extendZodWithOpenApi(z);

export type ApiOptions = {
    rootDir?: string;
}

export function api(options: ApiOptions = {}) {
    const app = new Hono();
    app.get("/v0/apps")
    app.get("/v0/apps/{app}")

    return {
        fetch: app.fetch
    }
}




