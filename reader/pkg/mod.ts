import { ensureDir } from "jsr:@std/fs@1.0.9"
import Parser from "npm:rss-parser@3.13.0"
import * as path from "jsr:@std/path@1.0.8"
import { FileServer } from "jsr:@smallweb/file-server@0.6.12"
import { NodeHtmlMarkdown } from "npm:node-html-markdown@1.3.0"

export type Feed = string | { url: string, id: string, tags: string[] }

export type ReaderOptions = {
    feeds: Feed[]
}

function clean(str: string) {
    str = str.toLowerCase().replace(/[^a-z0-9]/g, "-")

    if (str.startsWith("-")) {
        str = str.slice(1)
    }

    if (str.endsWith("-")) {
        str = str.slice(0, -1)
    }

    str = str.replace(/-+/g, "-")
    return str
}

export class Reader {
    fileServer: FileServer
    constructor(public opts: ReaderOptions) {
        this.fileServer = new FileServer({ rootDir: "./data", })
    }

    fetch: (req: Request) => Response | Promise<Response> = (req: Request) => {
        return this.fileServer.fetch(req)
    }

    run: (args: string[]) => void | Promise<void> = async () => {
        await ensureDir("./data")

        const parser = new Parser()

        const links: string[] = []
        for (const item of this.opts.feeds) {
            const rawUrl = typeof item === "string" ? item : item.url
            const feed = await parser.parseURL(rawUrl)
            const url = new URL(rawUrl)
            const id = typeof item === "string" ? url.hostname : clean(item.id)
            const dir = path.join("data", "feeds", id)

            await ensureDir(dir)

            for (const item of feed.items) {
                const pubDate = new Date(item.pubDate!).toISOString().split("T")[0]
                const filename = pubDate + "_" + clean(item.title!) + ".md"
                await Deno.writeTextFile(path.join(dir, filename), `
---
title: ${item.title}
favicon: https://fav.farm/📚
---

# ${item.title}

${NodeHtmlMarkdown.translate(item.content!)}
`.trimStart())
                links.push(`- _${pubDate}_ - [${item.title}](./feeds/${id}/${filename}) _[(${id})](${item.link})_`)
            }
        }

        const hompage = /* markdown */ `
---
title: Smallweb Reader
favicon: https://fav.farm/📚
head:
  - tag: script
    attrs:
      src: https://esm.smallweb.run/scripts/dot-shortcut.js
      data-url: https://editor.smallweb.run/reader/data/index.md
---

# Articles

${links.sort((a, b) => b.localeCompare(a)).join("\n")}

`.trimStart()

        Deno.writeTextFile("./data/index.md", hompage)
    }
}
