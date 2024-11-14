import { VSCode } from "./pkg/mod.ts";

const vscode = new VSCode({
    rootDir: Deno.env.get("SMALLWEB_DIR"),
});

export default vscode;
