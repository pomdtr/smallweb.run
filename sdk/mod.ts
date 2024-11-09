import * as path from "@std/path";

export type Config = {
    addr?: string;
    cert?: string;
    key?: string;
    domain: string;
    customDomains?: string[];
};

export type AppConfig = {
    root: string;
    entrypoint: string;
    admin: boolean;
    crons: string[];
};

export type App = {
    name: string;
    url: string;
    dir: string;
};

export type FullApp = App & {
    config: AppConfig;
};

export class Smallweb {
    public config: Config;

    constructor(public dir: string) {
        this.config = JSON.parse(
            Deno.readTextFileSync(`${dir}/.smallweb/config.json`),
        );
    }

    get app() {
        return {
            list: async () => {
                const entries = await Array.fromAsync(Deno.readDir(this.dir));
                return entries.filter((entry) =>
                    entry.isDirectory && !entry.name.startsWith(".")
                ).map((entry) => ({
                    name: entry.name,
                    url: `https://${entry.name}.${this.config.domain}/`,
                    dir: path.join(this.dir, entry.name),
                }));
            },
            get: async (name: string) => {
                const appDir = path.join(this.dir, name);
                const stat = await Deno.stat(appDir).catch(() => null);
                if (!stat) {
                    return null;
                }

                const config: AppConfig = {
                    root: appDir,
                    entrypoint: "main.ts",
                    admin: false,
                    crons: [],
                };

                return {
                    name,
                    url: `https://${name}.${this.config.domain}/`,
                    dir: appDir,
                    config,
                };
            },
        };
    }
}
