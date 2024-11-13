import { VSCode } from "./mod.ts";
import { lastlogin } from "jsr:@pomdtr/lastlogin@0.5.2";

const vscode = new VSCode();
vscode.fetch = lastlogin(vscode.fetch);

export default vscode;
