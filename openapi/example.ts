import { createClient, type NormalizeOAS } from 'npm:fets'
import type openapi from 'jsr:@smallweb/openapi'

const client = createClient<NormalizeOAS<typeof openapi>>({
    endpoint: 'https://<your-domain>',
    globalParams: {
        headers: {
            Authorization: 'Bearer <your-token>'
        }
    }
})

const response = await client['/v0/apps/{app}'].get({
    params: {
        app: "demo" // params are automatically typed
    }
})
if (!response.ok) {
    throw new Error("Failed to fetch app")
}

const app = await response.json() // typed as App
console.log(app)
