import { createClient, type NormalizeOAS } from 'npm:fets@0.8.3'
import type openapi from 'https://esm.town/v/pomdtr/smallweb_openapi?v=1'

const client = createClient<NormalizeOAS<typeof openapi>>({
    endpoint: Deno.env.get("SMALLWEB_API_URL"),
    globalParams: {
        headers: {
            "Authorization": `Bearer ${Deno.env.get("SMALLWEB_API_TOKEN")}`
        }
    }
})

const resp = await client['/v0/apps/{app}/config'].get({ params: { app: 'demo' } })
if (!resp.ok) {
    throw new Error(resp.statusText)
}

const config = await resp.json()
console.log(config.entrypoint)

