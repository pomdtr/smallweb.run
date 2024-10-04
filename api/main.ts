import { swaggerUI } from "@hono/swagger-ui";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import { listVersions } from "./github.ts";
import * as semver from "@std/semver";

const app = new OpenAPIHono();

app.doc("/openapi.json", {
    openapi: "3.0.0",
    info: {
        version: "1.0.0",
        title: "Smallweb REST API",
    },
});

// const templatesRoute = createRoute({
//     method: "get",
//     path: "/v1/templates",
//     responses: {
//         200: {
//             content: {
//                 "application/json": {
//                     schema: z.array(Repository),
//                 },
//             },
//             description: "List of Smallweb templates",
//         },
//     },
// });

// app.openapi(templatesRoute, async (c) => {
//     const templates = await listTemplates();
//     return c.json(templates || [], 200);
// });

const versionsRoute = createRoute({
    method: "get",
    path: "/v1/versions",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.array(z.string()),
                },
            },
            description: "List of Smallweb versions",
        },
    },
});

app.openapi(versionsRoute, async (c) => {
    const versions = await listVersions();
    return c.json(versions?.map((v) => semver.format(v)) || [], 200);
});

const latestVersionRoute = createRoute({
    method: "get",
    path: "/v1/versions/latest",
    responses: {
        200: {
            content: {
                "text/plain": {
                    schema: z.string(),
                },
            },
            description: "Latest Smallweb version",
        },
        404: {
            content: {
                "text/plain": {
                    schema: z.string(),
                },
            },
            description: "No versions found",
        },
    },
});

app.openapi(latestVersionRoute, async (c) => {
    const versions = await listVersions();
    if (!versions) {
        return c.text("No versions found", 404);
    }

    const latest = semver.maxSatisfying(versions, semver.parseRange("*"));
    if (!latest) {
        return c.text("No versions found", 404);
    }

    return c.text(semver.format(latest), 200);
});

app.get("/", swaggerUI({ url: "/openapi.json" }));

export default app;
