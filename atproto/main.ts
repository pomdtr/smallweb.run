import { Agent, CredentialSession } from "npm:@atproto/api"
import { Smallweb } from "jsr:@smallweb/sdk"

// const { BSKY_APP_PASSWORD } = Deno.env.toObject()

// const session = new CredentialSession(new URL("https://bsky.social"))

// await session.login({
//     identifier: "pomdtr.me",
//     password: BSKY_APP_PASSWORD
// })

// const agent = new Agent(session)

const smallweb = new Smallweb()

export default {
    async run() {
        const apps = await smallweb.apps.list()
        console.log(apps.map(app => app.name))

    }
}
