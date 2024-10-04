import { Hono } from "jsr:@hono/hono@4.5.0";
import { serveStatic } from "jsr:@hono/hono@4.5.0/deno";

const app = new Hono();

app.get("/", (c) => {
    return c.redirect("/app.schema.json");
});

app.get("/app", (c) => {
    return c.redirect("/app.schema.json");
});

app.get("/config", (c) => {
    return c.redirect("/config.schema.json");
});

app.get("/deno", (c) => {
    return c.redirect("/deno.schema.json");
});

app.get("/next", (c) => {
    return c.redirect("/next.schema.json");
});

app.use(
    "*",
    serveStatic({
        root: "./static",
    }),
);

export default app;
