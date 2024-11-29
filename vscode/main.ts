import { VSCode } from "jsr:@smallweb/vscode@0.1.0"

const vscode = new VSCode({
    rootDir: Deno.env.get("SMALLWEB_DIR"),
    lastlogin: true
});

export default vscode;
