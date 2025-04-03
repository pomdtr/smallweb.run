import { Hono } from "hono"
import * as path from "@std/path"
import * as fs from "@std/fs"
import * as jsonc from "@std/jsonc"
import type * as smallweb from "@smallweb/types"

export type SmallwebOptions = {
    rootDir: string
}

export type App = {
    name: string
    admin: boolean
    private: boolean
    domain: string
    additionalDomains: string[]
    authorizedEmails: string[]
    authorizedKeys: string[]
    authorizedGroups: string[]
    publicRoutes: string[]
    privateRoutes: string[]
}

export class Smallweb {
    private server
    constructor(opts: SmallwebOptions) {
        this.server = createServer(opts)
    }

    fetch: (req: Request) => Response | Promise<Response> = (req) => {
        return this.server.fetch(req)
    }
}

export async function loadConfig(rootDir: string): Promise<smallweb.Config> {
    for (const configPath of [
        path.join(rootDir, ".smallweb", "config.jsonc"),
        path.join(rootDir, ".smallweb", "config.json"),
    ]) {
        if (!await fs.exists(configPath)) {
            continue
        }

        const content = await Deno.readTextFile(configPath)
        const config: smallweb.Config = jsonc.parse(content)
        return config
    }

    throw new Error("Config file not found")
}

export async function listApps(rootDir: string): Promise<App[]> {
    const config = await loadConfig(rootDir)
    const entries = await Array.fromAsync(Deno.readDir(rootDir))

    const apps: App[] = entries.filter((entry) => !entry.name.startsWith(".") && entry.isDirectory).map((entry) => ({
        name: entry.name,
        admin: config.apps?.[entry.name]?.admin || false,
        private: config.apps?.[entry.name]?.private || false,
        privateRoutes: config.apps?.[entry.name]?.privateRoutes || [],
        publicRoutes: config.apps?.[entry.name]?.publicRoutes || [],
        crons: config.apps?.[entry.name]?.crons || [],
        domain: `${entry.name}.${config.domain}`,
        additionalDomains: [
            ...config.additionalDomains?.map((additionalDomain) => `${entry.name}.${additionalDomain}`) || [],
            ...config.apps?.[entry.name]?.additionalDomains || []
        ],
        authorizedEmails: [
            ...config.authorizedEmails || [],
            ...config.apps?.[entry.name]?.authorizedEmails || []
        ],
        authorizedKeys: [
            ...config.authorizedKeys || [],
            ...config.apps?.[entry.name]?.authorizedKeys || []
        ],
        authorizedGroups: [
            ...config.authorizedGroups || [],
            ...config.apps?.[entry.name]?.authorizedGroups || []
        ],
    }))

    return apps
}

function createServer(opts: SmallwebOptions) {
    const app = new Hono()

    app.get("/", (c) => {
        return c.text("OK")
    })

    app.get("/config", async (c) => {
        const config = await loadConfig(opts.rootDir)
        return c.json(config)
    })

    app.get("/apps", async (c) => {
        const apps = await listApps(opts.rootDir)

        return c.json(apps)
    })

    app.get("/caddy/ask", async (c) => {
        const domain = c.req.query("domain")
        if (!domain) {
            return c.json({ error: "domain param is required" }, 400)
        }

        const apps = await listApps(opts.rootDir)
        for (const app of apps) {
            if (app.domain === domain) {
                return c.text("OK")
            }

            if (app.additionalDomains.includes(domain)) {
                return c.text("OK")
            }
        }

        return c.text("domain not found", 404)
    })

    return app
}

