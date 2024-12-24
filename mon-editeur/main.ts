import { VSCode } from 'jsr:@smallweb/vscode@0.1.10';

const vscode = new VSCode({
    rootDir: Deno.env.get("SMALLWEB_DIR") + "/mon-blog",
    password: "12345"
});

export default vscode;
