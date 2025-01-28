import { issuer } from "@openauthjs/openauth"
import { GithubProvider } from "@openauthjs/openauth/provider/github"
import { MemoryStorage } from "@openauthjs/openauth/storage/memory"
import { Octokit } from "octokit"
import { object, string } from "valibot"
import { THEME_SST } from "@openauthjs/openauth/ui/theme"
import { createSubjects } from "@openauthjs/openauth/subject"
import ssh from "npm:ssh2"

import * as fs from "@std/fs"
import * as path from "@std/path"


const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, SMALLWEB_ADMIN, SMALLWEB_DIR } = Deno.env.toObject()
if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    throw new Error("Missing required env vars")
}

if (!SMALLWEB_ADMIN) {
    throw new Error("Not an admin app")
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

                const authorizedKeysPath = path.join(SMALLWEB_DIR, ".smallweb", "authorized_keys")
                if (!await fs.exists(authorizedKeysPath)) {
                    throw new Error("No authorized_keys file")
                }

                const authorizedKeys = await Deno.readTextFile(authorizedKeysPath)
                const res = await octokit.rest.users.listPublicSshKeysForAuthenticatedUser()
                const publicKeys = res.data.map((item) => ssh.utils.parseKey(item.key))

                for (const line of authorizedKeys.split("\n")) {
                    if (!line) continue
                    if (line.startsWith("#")) continue
                    const authorizedKey = ssh.utils.parseKey(line)

                    for (const publicKey of publicKeys) {
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

export default {
    async fetch(req: Request) {
        await fs.ensureDir("./data")
        return auth.fetch(req)
    }
}
