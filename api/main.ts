import { SmallwebApi } from "./pkg/mod.ts";

const api = new SmallwebApi(
    {
        publicRoutes: ["/", "/openapi.json"],
    },
);

export default api;
