import { VSCode } from "./src/mod.ts";
import { lastlogin } from "jsr:@pomdtr/lastlogin@0.5.2";

const vscode = new VSCode();
vscode.fetch = lastlogin(vscode.fetch);

export default vscode;
