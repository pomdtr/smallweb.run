import { ensureDir } from "jsr:@std/fs"
import Parser from "npm:rss-parser@3.13.0"
import { NodeHtmlMarkdown } from "npm:node-html-markdown"

export type Feed = string | { url: string, id: string }

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
    constructor(public opts: ReaderOptions) { }

    run: (args: string[]) => void | Promise<void> = async (args: string[]) => {
        await ensureDir("./data")

        const parser = new Parser()

        const links: string[] = []
        for (const item of this.opts.feeds) {
            const rawUrl = typeof item === "string" ? item : item.url
            const feed = await parser.parseURL(rawUrl)
            const url = new URL(rawUrl)
            const id = typeof item === "string" ? url.hostname : clean(item.id)
            await ensureDir(`./data/${id}`)

            for (const item of feed.items) {
                const pubDate = new Date(item.pubDate!).toISOString().split("T")[0]
                const filename = pubDate + "_" + clean(item.title!)
                await Deno.writeTextFile(`./data/${id}/${filename}.md`, [`# ${item.title}`, NodeHtmlMarkdown.translate(item.content!)].join("\n\n"))
                links.push(`- _${pubDate}_ - [${item.title}](${id}/${filename}.md) _[(${id})](${url.origin})_`)
            }
        }

        const hompage = /* markdown */ `
---
title: "Smallweb Reader"
favicon: "https://fav.farm/📚"
---

# Articles

${links.sort((a, b) => a.localeCompare(b)).join("\n")}

`.trimStart()

        Deno.writeTextFile("./data/index.md", hompage)
    }
}
