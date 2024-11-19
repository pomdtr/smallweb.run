import { AtpAgent } from "npm:@atproto/api@0.13.16"

export default {
    fetch: () => Response.redirect("https://bsky.app/profile/smallweb.run"),
    run: async () => {
        const password = Deno.env.get('BSKY_PASSWORD')
        if (!password) {
            throw new Error('BSKY_PASSWORD not set')
        }

        const agent = new AtpAgent({ service: 'https://bsky.social' })

        const res = await agent.login({
            identifier: 'smallweb.run',
            password,
        })

        await agent.post({
            text: "Sent from smallweb cli!"
        })

        console.log(res)
    }
}
