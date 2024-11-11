import { VSCode } from "./src/mod.ts";
import { lastlogin } from "jsr:@pomdtr/lastlogin@0.5.2";

const vscode = new VSCode();

export default {
    fetch: lastlogin(vscode.fetch),
};
