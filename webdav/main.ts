import { createAPI } from "jsr:@smallweb/api@0.3.0"

const api = createAPI()

export default {
    fetch: (req: Request) => {
        const url = new URL(req.url)
        return api.fetch(new Request(new URL(`/webdav${url.pathname}`, url.origin), req))
    }
}
