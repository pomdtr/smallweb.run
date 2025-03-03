import { issuer } from "@openauthjs/openauth";
import { GithubProvider } from "@openauthjs/openauth/provider/github";
import { MemoryStorage } from "@openauthjs/openauth/storage/memory";
import { Octokit } from "octokit";
import { THEME_SST } from "@openauthjs/openauth/ui/theme";
import { subjects } from "./subjects.ts";
import * as fs from "@std/fs";

export class GithubAuthServer {
  private issuer;
  constructor(opts: { clientID: string; clientSecret: string }) {
    this.issuer = issuer({
      theme: THEME_SST,
      providers: {
        github: GithubProvider({
          clientID: opts.clientID,
          clientSecret: opts.clientSecret,
          scopes: ["user:email"],
        }),
      },
      storage: MemoryStorage({
        persist: "./data/db.json",
      }),
      subjects,
      success: async (res, input) => {
        switch (input.provider) {
          case "github": {
            const octokit = new Octokit({
              auth: input.tokenset.access,
            });

            const {
              data: { login },
            } = await octokit.rest.users.getAuthenticated();

            const emails = await octokit.rest.users
              .listEmailsForAuthenticatedUser();
            const email = emails.data.find((email) => email.primary)
              ?.email;

            if (!email) throw new Error("No primary email");
            return res.subject("user", {
              username: login,
              email,
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
