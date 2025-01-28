import { createServer } from "./server.ts";

export type RequestHandler = (req: Request) => Response | Promise<Response>;

export type WindowFsOptions = {
    fsRoot: string;
}

export function clientFs(opts: WindowFsOptions, handler: RequestHandler): RequestHandler {
    const server = createServer(opts.fsRoot || "./data")

    return (req: Request) => {
        if (req.url.startsWith("/_fs")) {
            return server.fetch(req)
        }

        return handler(req)
    }
}

