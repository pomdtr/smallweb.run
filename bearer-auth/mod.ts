type HandleFn = (req: Request) => Response | Promise<Response>

export type BearerAuthParams = {
    verifyToken: (token: string) => boolean | Promise<boolean>
    publicRoutes?: string[]
}

export function bearerAuth(next: HandleFn, params: BearerAuthParams): HandleFn {
    const {
        publicRoutes = [],
        verifyToken
    } = params

    return async (req: Request) => {
        for (const route of publicRoutes) {
            const pattern = new URLPattern({ pathname: route })
            if (pattern.test(req.url)) {
                return next(req)
            }
        }

        const token = req.headers.get("Authorization")?.split("Bearer ")[1]
        if (!token) {
            return new Response("Unauthorized", { status: 401 })
        }

        if (!await verifyToken(token)) {
            return new Response("Unauthorized", { status: 401 })
        }
        return next(req)
    }
}
