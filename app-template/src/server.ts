import { Hono } from "hono";

export type ServerParams = {
    name: string;
};

export function createServer(params: ServerParams) {
    return new Hono().get("/", (c) => {
        return c.text(`Hello ${params.name}!`);
    });
}
