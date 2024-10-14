import { readme } from "./mod.ts";

export default readme({
    apiUrl: Deno.env.get("SMALLWEB_API_URL"),
    apiToken: Deno.env.get("SMALLWEB_API_TOKEN"),
});
