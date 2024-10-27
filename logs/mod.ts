import { fetchApi } from "jsr:@smallweb/api@0.1.2";
import { App } from "jsr:@smallweb/types@^0.1.0";

export function logs(): App {
    return {
        fetch: () => {
            return fetchApi("/v0/logs/http")
        }
    }
}
