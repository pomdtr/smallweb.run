import { issuer } from "@openauthjs/openauth"
import { GithubProvider } from "@openauthjs/openauth/provider/github"
import { MemoryStorage } from "@openauthjs/openauth/storage/memory"
import { Octokit } from "octokit"
import { object, string } from "valibot"
import { THEME_SST } from "@openauthjs/openauth/ui/theme"
import { createSubjects } from "@openauthjs/openauth/subject"
import ssh from "npm:ssh2"

import * as fs from "@std/fs"


// make sure that the data dir exists
fs.ensureDirSync("./data")

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

                const authorizedKeys = await Deno.readTextFile("authorized_keys")
                const { data: publicKeys } = await octokit.rest.users.listPublicSshKeysForAuthenticatedUser()

                for (const line of authorizedKeys.split("\n")) {
                    if (!line) continue
                    if (line.startsWith("#")) continue
                    const authorizedKey = ssh.utils.parseKey(line)

                    for (const item of publicKeys) {
                        const publicKey = ssh.utils.parseKey(item.key)

                        if (authorizedKey.getPublicPEM() === publicKey.getPublicPEM()) {
                            return ctx.subject("user", { email })
                        }
                    }
                }

                throw new Error("No authorized key found")
            }
        }
    }
})

export default auth
