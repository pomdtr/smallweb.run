import { serveDir } from "@std/http"
import Parser from "rss-parser"
import vento from "@vento/vento"
import template from "./template.ts"
import * as fs from "@std/fs"
import * as path from "@std/path"

const parser = new Parser()

export type TinyFeedOptions = {
    title?: string;
    description?: string;
    outPath?: string;
    feeds: string[];
}

export type Item = {
    title: string;
    link: string;
    publication: string | null;
    domain: string;
}

export class TinyFeed {
    constructor(public opts: TinyFeedOptions) { }

    fetch: (req: Request) => Response | Promise<Response> = (req: Request) => {
        return serveDir(req, {
            fsRoot: "./data",
        })
    }

    run: (args: string[]) => void | Promise<void> = async () => {
        const items: Item[] = []
        const feeds = await Promise.all(this.opts.feeds.map(async (feedUrl) => {
            const feed = await parser.parseURL(feedUrl)

            for (const item of feed.items) {
                if (!item.link) {
                    continue
                }

                items.push({
                    title: item.title || "",
                    link: item.link,
                    publication: item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : null,
                    domain: new URL(item.link).hostname
                })
            }

            return feed
        }))

        const env = vento()
        const res = await env.runString(template, {
            title: this.opts.title || "TinyFeed",
            description: this.opts.description,
            items: items.sort((a, b) => {
                const dateComparison = new Date(b.publication || "").getTime() - new Date(a.publication || "").getTime();
                if (dateComparison !== 0) {
                    return dateComparison;
                }
                return a.title.localeCompare(b.title);
            }),
            feeds,
        })

        await fs.ensureDir(path.dirname(this.opts.outPath || "./data/index.html"))
        await Deno.writeTextFile(this.opts.outPath || "./data/index.html", res.content)
    }
}
