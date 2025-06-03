import vento from "@vento/vento"
import { Command } from '@commander-js/extra-typings';
import Parser from "rss-parser"
import template from "./template.ts"
import { Feed } from "feed"

export type Storage = {
    getItem: (name: string) => Promise<string | null>;
    setItem(name: string, value: string): Promise<void>;
}

export type TinyfeedOptions = {
    title?: string;
    description?: string;
    feeds: string[];
    storage: Storage;
}


type Item = {
    title: string;
    link: string;
    publication: string | null;
    domain: string;
}


export class Tinyfeed {
    private cli
    private parser
    private env

    constructor(public opts: TinyfeedOptions) {
        this.parser = new Parser()
        this.env = vento()

        this.cli = new Command("tinyfeed")

        this.cli.command("build").action(async () => {
            await this.build()
        })
    }

    build: () => Promise<void> = async () => {
        const items: Item[] = []
        const feeds = await Promise.all(this.opts.feeds.map(async (feedUrl) => {
            const resp = await fetch(feedUrl)

            if (!resp.ok) {
                console.error(`Failed to fetch feed ${feedUrl}: ${resp.status} ${resp.statusText}`)
                return null
            }

            const feed = await this.parser.parseString(await resp.text())
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


        const feed = new Feed({
            title: this.opts.title || "Tinyfeed",
            id: "{{ id }}",
            description: this.opts.description,
            copyright: "NA",
        })
        for (const item of items) {
            feed.addItem({
                title: item.title,
                id: item.link,
                link: item.link,
                date: new Date(item.publication || ""),
            })
        }

        await this.opts.storage.setItem("feed.xml", feed.atom1())

        const res = await this.env.runString(template, {
            title: this.opts.title || "Tinyfeed",
            description: this.opts.description,
            items: items.sort((a, b) => {
                const dateComparison = new Date(b.publication || "").getTime() - new Date(a.publication || "").getTime();
                if (dateComparison !== 0) {
                    return dateComparison;
                }
                return a.title.localeCompare(b.title);
            }),
            feeds: feeds.filter(Boolean)
        })


        await this.opts.storage.setItem("index.html", res.content)
        console.error(`Built static page from ${this.opts.feeds.length} feeds`)
    }

    fetch: (req: Request) => Response | Promise<Response> = async (_req) => {
        const url = new URL(_req.url)

        if (url.pathname === "/feed.xml") {
            const feed = await this.opts.storage.getItem("feed.xml")
            if (!feed) {
                return new Response("Not found", {
                    status: 404
                })
            }

            const res = await this.env.runString(feed, {
                id: url.origin,
            })
            return new Response(res.content, {
                headers: {
                    "Content-Type": "application/atom+xml"
                }
            })
        }

        const body = await this.opts.storage.getItem("index.html")
        if (!body) {
            return new Response("Not found", {
                status: 404
            })
        }

        return new Response(await this.opts.storage.getItem("index.html"), {
            headers: {
                "Content-Type": "text/html"
            }
        })
    }


    run: (args: string[]) => void | Promise<void> = async (args) => {
        await this.cli.parseAsync(args, {
            from: "user"
        })
    }
}
