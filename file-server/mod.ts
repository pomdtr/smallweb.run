import * as http from "@std/http";
import * as path from "@std/path";
import { transpile } from "@deno/emit";

const cache = await caches.open("file-server");

type FileServerConfig = {
    /**
     * Whether to transpile files with .ts, .jsx or .tsx extensions to javascript.
     * @default false
     */
    transpile?: boolean;
} & http.ServeDirOptions;

export class FileServer {
    constructor(private config: FileServerConfig = {}) {}

    fetch: (req: Request) => Response | Promise<Response> = async (req) => {
        const url = new URL(req.url);
        const resp = await http.serveDir(req, this.config);
        if (!resp.ok) {
            return resp;
        }

        const extension = path.extname(url.pathname);
        if (
            this.config.transpile && [".ts", ".tsx", ".jsx"].includes(extension)
        ) {
            console.error("Transforming", url.href);
            const cached = await cache.match(req);
            if (
                cached &&
                cached.headers.get("last-modified") ===
                    resp.headers.get("last-modified")
            ) {
                return cached;
            }

            const script = await resp.text();
            try {
                let contentType: string;
                switch (extension) {
                    case ".ts":
                        contentType = "text/typescript";
                        break;
                    case ".tsx":
                        contentType = "text/tsx";
                        break;
                    case ".jsx":
                        contentType = "text/jsx";
                        break;
                    default:
                        throw new Error("Invalid extension");
                }

                const result = await transpile(url, {
                    load: (url) => {
                        return Promise.resolve({
                            kind: "module",
                            specifier: url,
                            headers: {
                                "content-type": contentType,
                            },
                            content: script,
                        });
                    },
                });
                const code = result.get(url.href);

                const res = new Response(code, {
                    headers: {
                        "Content-Type": "text/javascript",
                        "last-modified": resp.headers.get("last-modified") ||
                            "",
                    },
                    status: resp.status,
                });

                if (this.config.enableCors) {
                    res.headers.set("Access-Control-Allow-Origin", "*");
                }

                await cache.put(req, res.clone());
                return res;
            } catch (e) {
                console.error("Error transforming", e);
                return new Response(script, {
                    status: 500,
                    headers: {
                        "Content-Type": "text/javascript",
                    },
                });
            }
        }

        return resp;
    };
}

const fileServer: FileServer = new FileServer({
    transpile: true,
    showDirListing: true,
    enableCors: true,
});

export default fileServer;
