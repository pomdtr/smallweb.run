import * as fs from "jsr:@std/fs"
import * as path from "jsr:@std/path"

interface FileTree {
    [key: string]: FileTree;
}

/**
 * Creates a file tree structure from an array of paths
 * @param paths Array of file/directory paths
 * @returns A nested object representing the file tree
 */
function createFileTree(paths: string[]): FileTree {
    const tree: FileTree = {};

    paths.forEach(path => {
        const parts = path.replace(/^\.\//, "").split("/");
        let current = tree;

        parts.forEach(part => {
            if (!current[part]) {
                current[part] = {};
            }
            current = current[part];
        });
    });

    return tree;
}

/**
 * Renders a tree structure as a string with indentation
 * @param tree The file tree to render
 * @param indent Current indentation string
 * @returns A formatted string representation of the tree
 */
function renderTree(tree: FileTree, indent: string = ""): string {
    let result = "";

    const entries = Object.entries(tree);
    entries.sort(([aKey], [bKey]) => aKey.localeCompare(bKey));

    entries.forEach(([key, value], index) => {
        const isLast = index === entries.length - 1;
        const prefix = isLast ? "└── " : "├── ";

        result += `${indent}${prefix}${key}\n`;

        if (Object.keys(value).length > 0) {
            const childIndent = indent + (isLast ? "    " : "│   ");
            result += renderTree(value, childIndent);
        }
    });

    return result;
}

async function getTree(root: string) {
    const files = await Array.fromAsync(fs.walk(root, {
        skip: [/node_modules/, /dist/, /cache/, /\.smallweb\/repos/, /blog\/_site/],
    }));

    return createFileTree(files.slice(1).map(file => path.relative("..", file.path)));
}

export default {
    fetch: async (req: Request) => {
        const url = new URL(req.url);
        const tree = await getTree(path.join("..", url.pathname))
        return new Response(`.\n${renderTree(tree)}`, {
            headers: {
                "content-type": "text/plain; charset=utf-8",
            },
        });
    },
    run: async (args: string[]) => {
        const tree = await path.join("..", ...args)
        const fileTree = await getTree(tree);
        console.log(`.\n${renderTree(fileTree)}`);
    }
}
