import { VSCode } from "./pkg/mod.ts";
import { lastlogin } from "jsr:@pomdtr/lastlogin@0.5.7"

const vscode = new VSCode({
    rootDir: "data"
});

vscode.fetch = lastlogin(vscode.fetch, {
    publicRoutes: ["/api/*", "/openapi.json", "/manifest.json"],
})

export default vscode;
