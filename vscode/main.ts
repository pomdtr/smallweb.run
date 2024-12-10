import { VSCode } from "jsr:@smallweb/vscode@0.1.6"

const vscode = new VSCode({
    rootDir: Deno.env.get("SMALLWEB_DIR")
});

export default vscode;
