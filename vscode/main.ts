import { VSCode } from "./pkg/mod.ts";

const vscode = new VSCode({
    rootDir: "..",
});

// vscode.fetch = lastlogin(vscode.fetch, {
//     publicRoutes: ["/api/*", "/manifest.json", "/openapi.json", "/openapi.ts"],
// });

export default vscode;
