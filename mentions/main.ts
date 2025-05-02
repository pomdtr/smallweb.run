import { BlueskyMentions } from "./mod.ts"

const { BSKY_PASSWORD, DISCORD_TOKEN } = Deno.env.toObject()

const mentions = new BlueskyMentions({
    bskyUsername: "smallweb.run",
    bskyPassword: BSKY_PASSWORD,
    queries: [
        "https://smallweb.run",
        "@smallweb.run"
    ],
    ignoredUsers: [
        "pomdtr.me",
        "smallweb.run"
    ],
    discordToken: DISCORD_TOKEN
})

export default mentions
