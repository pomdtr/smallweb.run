import type { App } from "@smallweb/types"

export function fetchApi(path: string, init?: RequestInit): Promise<Response> {
    return fetch(new URL(path, Deno.env.get("SMALLWEB_API_URL")), init)
}

export function webdav(): App {
    return {
        fetch: (req) => {
            const url = new URL(req.url)
            return fetchApi(`/webdav${url.pathname}${url.search}`, req)
        }
    }
}

export function api(): App {
    return {
        fetch: (req) => {
            const url = new URL(req.url)
            return fetchApi(`${url.pathname}${url.search}`, req)
        }
    }
}
