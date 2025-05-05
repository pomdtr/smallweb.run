import * as jsonc from "@std/jsonc"
import * as path from "@std/path"
import * as fs from "@std/fs"

export type Config = {
    domain: string
    authorizedKeys?: string[]
    authorizedEmails?: string[]
    authorizedGroups?: string[]
    additionalDomains?: string[]
    oidc?: {
        issuer: string
    }
    apps?: {
        [name: string]: AppConfig
    }
}

export type AppConfig = {
    admin?: boolean
    authorizedKeys?: string[]
    authorizedEmails?: string[]
    authorizedGroups?: string[]
    additionalDomains?: string[]
}

export type AppManifest = {
    private?: boolean
    privateRoutes?: string[]
    publicRoutes?: string[]
    crons?: Cron[]
}

export type Cron = {
    schedule: string
    args: string[]
}

export class Smallweb {
    public config: Config
    public apps: SmallwebApps

    constructor(public dir?: string) {
        if (!dir && Deno.env.has("SMALLWEB_DIR")) {
            dir = Deno.env.get("SMALLWEB_DIR")!
        } else {
            throw new Error("SMALLWEB_DIR is not set")
        }

        const configPath = Smallweb.findConfigPath(dir)
        const configText = Deno.readTextFileSync(configPath)

        const config = jsonc.parse(configText) as Config

        this.config = config as Config
        this.apps = new SmallwebApps(dir, config)
    }

    static findConfigPath(dir: string): string {
        for (const configName of ["config.json", "config.jsonc"]) {
            const configPath = path.join(dir, ".smallweb", configName)
            if (!fs.existsSync(configPath)) {
                continue
            }

            return configPath
        }

        throw new Error("No config file found")
    }
}

export type App = {
    name: string
    domain: string
    url: string
    dir: string
    admin: boolean
    authorizedKeys: string[]
    authorizedEmails: string[]
    authorizedGroups: string[]
    additionalDomains: string[]
}

export type FullApp = App & {
    private: boolean
    privateRoutes: string[]
    publicRoutes: string[]
    crons: Cron[]
}

export class SmallwebApps {
    constructor(public dir: string, public config: Config) { }


    async list(): Promise<App[]> {
        const entries = Deno.readDir(this.dir)
        const apps: App[] = []

        for await (const entry of entries) {
            if (!entry.isDirectory) {
                continue
            }

            if (entry.name.startsWith(".")) {
                continue
            }

            const appConfig = this.config.apps?.[entry.name] || {}

            const additionalDomains = (this.config.additionalDomains ?? []).map((d) => `${entry.name}.${d}`)
            additionalDomains.push(...appConfig.additionalDomains ?? [])

            const authorizedKeys = (this.config.authorizedKeys ?? []).concat(appConfig.authorizedKeys ?? [])
            const authorizedEmails = (this.config.authorizedEmails ?? []).concat(appConfig.authorizedEmails ?? [])
            const authorizedGroups = (this.config.authorizedGroups ?? []).concat(appConfig.authorizedGroups ?? [])


            apps.push({
                name: entry.name,
                domain: `${entry.name}.${this.config.domain}`,
                url: `https://${entry.name}.${this.config.domain}`,
                dir: path.join(this.dir, name),
                admin: this.config.apps?.[name]?.admin ?? false,
                additionalDomains,
                authorizedKeys,
                authorizedEmails,
                authorizedGroups,
            })
        }

        return apps
    }

    async #loadManifest(name: string): Promise<AppManifest> {
        const manifestPath = path.join(this.dir, name, "manifest.json")
        if (!await fs.exists(manifestPath)) {
            return {}
        }

        const manifestText = await Deno.readTextFile(manifestPath)
        const manifest = jsonc.parse(manifestText) as AppManifest
        if (!manifest) {
            throw new Error(`Failed to parse manifest for ${name}`)
        }

        return {}
    }

    async get(name: string): Promise<FullApp | undefined> {
        const manifest = await this.#loadManifest(name)

        const appConfig = this.config.apps?.[name] || {}

        const additionalDomains = (this.config.additionalDomains ?? []).map((domain) => `${name}.${domain}`)
        additionalDomains.push(...appConfig.additionalDomains ?? [])

        const authorizedKeys = (this.config.authorizedKeys ?? []).concat(appConfig.authorizedKeys ?? [])
        const authorizedEmails = (this.config.authorizedEmails ?? []).concat(appConfig.authorizedEmails ?? [])
        const authorizedGroups = (this.config.authorizedGroups ?? []).concat(appConfig.authorizedGroups ?? [])

        return {
            name: name,
            domain: `${name}.${this.config.domain}`,
            url: `https://${name}.${this.config.domain}`,
            dir: path.join(this.dir, name),
            admin: this.config.apps?.[name]?.admin ?? false,
            additionalDomains,
            authorizedEmails,
            authorizedKeys,
            authorizedGroups,
            private: manifest.private ?? false,
            privateRoutes: manifest.privateRoutes ?? [],
            publicRoutes: manifest.publicRoutes ?? [],
            crons: manifest.crons ?? [],
        }

    }

}

