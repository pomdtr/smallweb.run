import { Hono } from "npm:hono@4.5.11";

const app = new Hono();

app.get("/");

app.get("/webdav", (c) => {
    return c.redirect("https://docs.smallweb.run/guides/webdav.html");
});

export default app;
