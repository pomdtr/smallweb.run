import { Hono } from "hono";
import homepage from "./homepage.ts";
import product from "./product.json" with { type: "json" };

export function createServer() {
    return new Hono().get("/", (c) => {
        return c.html(homepage);
    }).get("/product.json", (c) => {
        return c.json(product);
    });
}
