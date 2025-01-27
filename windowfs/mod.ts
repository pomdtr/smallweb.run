export type RequestHandler = (req: Request) => Response | Promise<Response>;

export type WindowFsOptions = {
}

export function windowfs(opts: WindowFsOptions, handler: RequestHandler) {

}
