import { VSCode } from "./pkg/mod.ts";
import { lastlogin } from "jsr:@pomdtr/lastlogin@0.5.7"

const vscode = new VSCode({
    rootDir: Deno.env.get("SMALLWEB_DIR")
});

vscode.fetch = lastlogin(vscode.fetch, {
    publicRoutes: ["/api/*", "/openapi.json", "/manifest.json"],
})

export default vscode;
