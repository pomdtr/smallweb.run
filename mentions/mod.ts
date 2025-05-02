import { Agent, CredentialSession } from "npm:@atproto/api@0.15.5"
import pMap from "npm:p-map";
import { ensureDir } from "jsr:@std/fs@1.0.17"
import { Low } from "npm:lowdb@7.0.1";
import { DataFile } from "npm:lowdb@7.0.1/node";
import { SuperJSON } from "npm:superjson@2.2.2"

await ensureDir("data")

const adapter = new DataFile<{
    lastRun: Date | null;
}>("data/db.json", {
    parse: (str) => SuperJSON.parse(str),
    stringify: (data) => SuperJSON.stringify(data),
})

const db = new Low(adapter, {
    lastRun: null,
})

await db.read()

export type BlueskyMentionsOptions = {
    bskyUsername: string;
    bskyPassword: string;
    queries: string[];
    ignoredUsers: string[];
    discordToken: string;
}

export class BlueskyMentions {
    constructor(
        private options: BlueskyMentionsOptions,
    ) { }



    run = async () => {
        const lastRun = await db.data.lastRun
        let posts = (
            await pMap(
                this.options.queries,
                q => this.search(q, lastRun),
                { concurrency: 1 }, // otherwise we get rate-limited
            )
        ).flat();

        await db.update((db) => { db.lastRun = new Date() })

        if (posts.length === 0) return;

        // format
        const content = posts.map(
            post => `https://bsky.app/profile/${post.author.handle}/post/${post.uri.split("/").at(-1)}`,
        ).join(
            "\n",
        );

        console.log(content)

    }

    async search(q: string, since?: Date | null) {
        const session = new CredentialSession(new URL("https://bsky.social"))
        await session.login({
            identifier: this.options.bskyUsername,
            password: this.options.bskyPassword
        })
        const agent = new Agent(session)

        const res = await agent.app.bsky.feed.searchPosts({
            q,
            sort: "latest",
            since: since?.toISOString(),
        });

        return res.data.posts
    }
}

