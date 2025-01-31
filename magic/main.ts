import * as fs from "jsr:@std/fs"
import Parser from "npm:web-tree-sitter";

await Parser.init();
const parser = new Parser()
const Lang = await Parser.Language.load('./tree-sitter-typescript.wasm')
parser.setLanguage(Lang)

function nodeToJson(node: Parser.SyntaxNode): any {
    return {
        type: node.type,
        children: node.children.map(nodeToJson),
    };
}

export default {
    async fetch(req: Request) {
        const url = new URL(req.url);
        const filepath = url.pathname == "/" ? "./index.ts" : `./${url.pathname.slice(1)}.ts`
        if (!await fs.exists(filepath)) {
            return new Response("Not found", { status: 404 })
        }

        if (req.method == "POST") {
            const { default: handler } = await import(filepath)
            const params = await req.json()
            const res = handler(params)
            return Response.json(res)
        }

        const code = await Deno.readTextFile(filepath)
        const tree = parser.parse(code)
        return Response.json(nodeToJson(tree.rootNode))
    }
}
