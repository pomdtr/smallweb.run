import { Hono } from "hono";
import { auth } from "./auth.ts";
import { cors } from "hono/cors";

const app = new Hono();
app.use(cors());

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

export default app;
