import { SmallwebApi } from "./src/mod.ts";

const api = new SmallwebApi(
    {
        publicRoutes: ["/", "/openapi.json"],
    },
);

export default api;
