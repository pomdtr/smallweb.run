import { GithubAuthServer } from "./pkg/server.ts";

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = Deno.env.toObject();

const authServer = new GithubAuthServer({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
});

export default authServer;
