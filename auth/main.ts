import { issuer } from "@openauthjs/openauth"
import { GithubProvider } from "@openauthjs/openauth/provider/github"
import { MemoryStorage } from "@openauthjs/openauth/storage/memory"
import { Octokit } from "octokit"
import { object, string, array } from "valibot"
import { THEME_SST } from "@openauthjs/openauth/ui/theme"
import { createSubjects } from "@openauthjs/openauth/subject"
import * as fs from "@std/fs"


const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = Deno.env.toObject()
if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    throw new Error("Missing required env vars")
}

const auth = issuer({
    theme: THEME_SST,
    providers: {
        github: GithubProvider({
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            scopes: ["user:email", "read:public_key"],
        }),
    },
    storage: MemoryStorage({
        persist: "./data/db.json",
    }),
    subjects: createSubjects({
        user: object({
            email: string(),
            keys: array(string()),
        }),
    }),
    success: async (ctx, value) => {
        switch (value.provider) {
            case "github": {
                const octokit = new Octokit({
                    auth: value.tokenset.access,
                })

                const emails = await octokit.rest.users.listEmailsForAuthenticatedUser()
                const email = emails.data.find((email) => email.primary)?.email
                if (!email) throw new Error("No primary email")
                const {data: keys} = await octokit.rest.users.listPublicSshKeysForAuthenticatedUser()
                return ctx.subject("user", { email, keys: keys.map(({key}) => key) })
            }
        }
    }
})

export default {
    async fetch(req: Request) {
        await fs.ensureDir("./data")
        return auth.fetch(req)
    }
}
