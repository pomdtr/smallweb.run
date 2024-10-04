import { codejar } from "./mod.ts";

export default codejar({
    apiUrl: Deno.env.get("SMALLWEB_API_URL"),
    apiToken: Deno.env.get("SMALLWEB_API_TOKEN"),
});
