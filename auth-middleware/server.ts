import { issuer } from "npm:@openauthjs/openauth";
import { GithubProvider } from "npm:@openauthjs/openauth/provider/github";
import { MemoryStorage } from "npm:@openauthjs/openauth/storage/memory";
import { Octokit } from "npm:octokit";
import { array, object, string } from "npm:valibot";
import { THEME_SST } from "npm:@openauthjs/openauth/ui/theme";
import { createSubjects } from "npm:@openauthjs/openauth/subject";
import * as fs from "jsr:@std/fs";

export class AuthServer {
    private issuer;
    constructor(opts: { clientID: string; clientSecret: string }) {
        this.issuer = issuer({
            theme: THEME_SST,
            providers: {
                github: GithubProvider({
                    clientID: opts.clientID,
                    clientSecret: opts.clientSecret,
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
                        });

                        const emails = await octokit.rest.users
                            .listEmailsForAuthenticatedUser();
                        const email = emails.data.find((email) => email.primary)
                            ?.email;
                        if (!email) throw new Error("No primary email");

                        const { data: publicKeys } = await octokit.rest.users
                            .listPublicSshKeysForAuthenticatedUser();

                        return ctx.subject("user", {
                            email,
                            keys: publicKeys.map(({ key }) => key),
                        });
                    }
                }
            },
        });
    }

    fetch: (req: Request) => Response | Promise<Response> = async (req) => {
        await fs.ensureDir("./data");
        return this.issuer.fetch(req);
    };
}
