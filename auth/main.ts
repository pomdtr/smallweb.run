import { issuer } from "@openauthjs/openauth";
import { GithubProvider } from "@openauthjs/openauth/provider/github";
import { CodeUI } from "@openauthjs/openauth/ui/code"
import { CodeProvider } from "@openauthjs/openauth/provider/code"
import { Octokit } from "octokit";
import { Resend } from 'resend';
import { MemoryStorage } from "@openauthjs/openauth/storage/memory";
import { createSubjects } from "@openauthjs/openauth/subject";
import { object, string } from "valibot";
import * as fs from "@std/fs";
import { oidc } from "@pomdtr/openauth-oidc"

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, RESEND_API_KEY } = Deno.env.toObject();
if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    throw new Error("Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET");
}

if (!RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY");
}

const resend = new Resend(RESEND_API_KEY);


await fs.ensureDir("./data");
const storage = MemoryStorage({
    persist: "./data/db.json",
})
const iss = issuer({
    providers: {
        github: GithubProvider({
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            scopes: ["user:email"],
        }),
        code: CodeProvider(
            CodeUI({
                sendCode: async (claims, code) => {
                    await resend.emails.send({
                        from: "Smallweb Auth <auth@smallweb.run>",
                        to: claims.email,
                        subject: "Your authentication code",
                        html: `Your authentication code is <strong>${code}</strong>`,
                    })
                }
            })
        )
    },
    allow: async (_input, _req) => {
        return true
    },
    storage,
    subjects: createSubjects({
        user: object({
            email: string(),
        })
    }),
    success: async (res, input) => {
        switch (input.provider) {
            case "github": {
                const octokit = new Octokit({
                    auth: input.tokenset.access,
                });

                const emails = await octokit.rest.users
                    .listEmailsForAuthenticatedUser();

                const email = emails.data.find((email) => email.primary)
                    ?.email;

                if (!email) throw new Error("No primary email");
                return res.subject("user", {
                    email,
                });
            }
            case "code": {
                return res.subject("user", {
                    email: input.claims.email,
                });
            }
        }
    },
})

export default oidc(iss, storage)
