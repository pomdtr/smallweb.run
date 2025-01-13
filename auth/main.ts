import { issuer } from "npm:@openauthjs/openauth@0.3.5"
import { GithubProvider } from "npm:@openauthjs/openauth@0.3.5/provider/github"
import { MemoryStorage } from "npm:@openauthjs/openauth/storage/memory"
import { Octokit } from "npm:octokit@4.1.0"
import { CodeUI } from "npm:@openauthjs/openauth/ui/code"
import { CodeProvider } from "npm:@openauthjs/openauth/provider/code"
import { Resend } from "npm:resend@4.0.1"
import { object, string } from "npm:valibot@1.0.0-beta.11"
import { THEME_SST } from "npm:@openauthjs/openauth/ui/theme"
import { createSubjects } from "npm:@openauthjs/openauth/subject"


const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, RESEND_API_KEY } = Deno.env.toObject()
if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !RESEND_API_KEY) {
    throw new Error("Missing required env vars")
}

const resend = new Resend(RESEND_API_KEY);

const auth = issuer({
    theme: THEME_SST,
    providers: {
        code: CodeProvider(CodeUI({
            sendCode: async (claims, code) => {
                await resend.emails.send({
                    from: "Smallweb Auth <auth@smallweb.run>",
                    to: claims.email,
                    subject: "Your smallweb code",
                    text: `Your code is ${code}`,
                })
            },
        })),
        github: GithubProvider({
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            scopes: ["user:email"],
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
                return ctx.subject("user", { email })
            }
            case "code": {
                return ctx.subject("user", { email: value.claims.email })
            }
        }
    }
})

export default {
    fetch(req: Request) {
        const url = new URL(req.url)
        if (url.pathname === "/") {
            return Response.redirect("https://gh.smallweb.run/auth/main.ts")
        }

        return auth.fetch(req)
    }
}
