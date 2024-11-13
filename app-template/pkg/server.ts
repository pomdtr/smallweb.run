import { Hono } from "hono";

export function createServer(params: {
    name: string;
}) {
    return new Hono().get("/", (c) => {
        return c.text(`Hello ${params.name}!`);
    });
}
