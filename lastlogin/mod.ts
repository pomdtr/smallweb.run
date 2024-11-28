import {
    type Cookie,
    deleteCookie,
    getCookies,
    setCookie,
} from "@std/http/cookie";
import * as jwt from "@hono/hono/jwt";

const JWT_COOKIE = "lastlogin_jwt";
const OAUTH_COOKIE = "oauth_store";

/**
 * Options for configuring the LastLogin module.
 */
/**
 * Options for configuring the LastLogin service.
 */
export type LastLoginOptions = {
    /**
     * The email address or addresses of the user.
     * It can also be passed using the LASTLOGIN_EMAIL environment variable.
     */
    email?: string | string[];

    /**
     * A function to verify the email address.
     * It can return a boolean or a Promise that resolves to a boolean.
     */
    verifyEmail?: (email: string) => Promise<boolean> | boolean;

    /**
     * The domain of the login service.
     * @default "lastlogin.io"
     */
    domain?: string;

    /**
     * The provider name for the login service.
     */
    provider?:
    | "google"
    | "github"
    | "facebook"
    | "gitlab"
    | "hello";

    /**
     * Indicates that authentication is optional.
     */
    public?: boolean;

    /**
     * An array of route paths that do not require authentication.
     * @default []
     */
    publicRoutes?: string[];

    /**
     * An array of route paths that require authentication.
     * @default []
     */
    privateRoutes?: string[];

    /**
     * The secret key used to sign the JWT token.
     * It can also be passed using the LASTLOGIN_SECRET_KEY environment variable.
     */
    secretKey?: string;
};

type Handler = (req: Request) => Response | Promise<Response>;

/**
 * Middleware function to handle user authentication and session management.
 *
 * @param next - The next fetch function to call in the middleware chain.
 * @param options - Configuration options for the lastlogin middleware.
 * @returns A fetch function that handles authentication and session management.
 *
 * @example
 * import { lastlogin } from './mod.ts';
 *
 * const options = {
 *   privateRoutes: ['/dashboard', '/settings'],
 *   provider: 'google',
 *   verifyEmail: async (email) => {
 *     // Custom email verification logic
 *     return email.endsWith('@example.com');
 *   },
 * };
 *
 * const handleRequest = async (req: Request) => {
 *   return new Response('Hello, world!');
 * };
 *
 * export default {
 *  fetch: lastlogin(handleRequest, options);,
 * };
 */
export function lastlogin(
    handler: Handler,
    options: LastLoginOptions = {},
): Handler {
    const {
        domain = "lastlogin.io",
        provider = Deno.env.get("LASTLOGIN_PROVIDER"),
    } = options;

    const verifyEmail = (email: string) => {
        if (typeof options.email == "string") {
            return email == options.email;
        }

        if (Array.isArray(options.email)) {
            return options.email.includes(email);
        }

        if (options.verifyEmail) {
            return options.verifyEmail(email);
        }

        const env = Deno.env.get("LASTLOGIN_EMAIL");

        if (!env) {
            return false;
        }

        const emails = env.trim().split(",");
        return emails.includes(email);
    };

    const isPublicRoute = (url: string) => {
        let isPublic = !!options.public;
        for (const pathname of options.privateRoutes ?? []) {
            const pattern = new URLPattern({ pathname });
            if (pattern.test(url)) {
                isPublic = false;
                break;
            }
        }

        for (const pathname of options.publicRoutes ?? []) {
            const pattern = new URLPattern({ pathname });
            if (pattern.test(url)) {
                isPublic = true;
            }
        }

        return isPublic;
    };

    const cookieAttrs: Partial<Cookie> = {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        path: "/",
    };

    const secretKey = options.secretKey || Deno.env.get("LASTLOGIN_SECRET_KEY");
    if (!secretKey) {
        throw new Error("Secret key is required");
    }

    return async (req: Request) => {
        if (req.method == "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                }
            });
        }

        // clone the request to modify it
        req = new Request(req);
        req.headers.delete("X-LastLogin-Email");
        const url = new URL(req.url);

        const authorization = req.headers.get("Authorization");
        if (authorization) {
            if (!authorization.startsWith("Bearer ")) {
                return new Response("Invalid Authorization header", {
                    status: 400,
                });
            }

            const token = authorization.slice(7);
            const payload = await jwt.verify(token, secretKey).catch(() => null);
            if (!payload || typeof payload.email != "string") {
                if (isPublicRoute(req.url)) {
                    return handler(req);
                }

                return new Response("Invalid token", { status: 401 });
            }

            if (payload.domain != url.hostname) {
                return new Response("Invalid domain", { status: 401 });
            }

            req.headers.set("X-LastLogin-Email", payload.email);
            return handler(req);
        }

        const clientID = `${url.protocol}//${url.host}/`;
        const redirectUri = `${url.protocol}//${url.host}/_auth/callback`;
        if (url.pathname == "/_auth/callback") {
            const cookies = await getCookies(req.headers);
            const store = JSON.parse(decodeURIComponent(cookies[OAUTH_COOKIE]));
            const state = url.searchParams.get("state");
            if (!state || state != store.state) {
                return new Response("state mismatch", { status: 400 });
            }

            const code = url.searchParams.get("code");
            if (!code) {
                return new Response("code not found", { status: 400 });
            }

            const tokenUrl = new URL(`https://${domain}/token`);
            tokenUrl.searchParams.set("client_id", clientID);
            tokenUrl.searchParams.set("code", code);
            tokenUrl.searchParams.set("redirect_uri", redirectUri);
            tokenUrl.searchParams.set("response_type", "code");
            tokenUrl.searchParams.set("state", store.state);

            const tokenResp = await fetch(tokenUrl.toString());
            if (!tokenResp.ok) {
                throw new Error(await tokenResp.text());
            }

            const { access_token } = (await tokenResp.json()) as {
                access_token: string;
            };

            const resp = await fetch(`https://${domain}/userinfo`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            const { email } = (await resp.json()) as { email: string };
            const res = new Response(null, {
                status: 302,
                headers: {
                    Location: store.redirect,
                },
            });

            const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
            const token = await jwt.sign({
                email,
                exp,
                domain: url.hostname,
            }, secretKey);

            deleteCookie(res.headers, OAUTH_COOKIE, cookieAttrs);
            setCookie(res.headers, {
                ...cookieAttrs,
                expires: new Date(exp * 1000),
                name: JWT_COOKIE,
                value: token,
            });

            return res;
        }

        if (url.pathname == "/_auth/logout") {
            const cookies = getCookies(req.headers);
            if (!(JWT_COOKIE in cookies)) {
                return new Response("session cookie not found", {
                    status: 401,
                });
            }

            const res = new Response(null, {
                status: 302,
                headers: {
                    Location: "/",
                },
            });

            deleteCookie(res.headers, JWT_COOKIE, cookieAttrs);
            return res;
        }

        const cookies = getCookies(req.headers);
        const payload = await jwt.verify(cookies[JWT_COOKIE], secretKey).catch(
            () => null,
        );
        if (
            !payload || typeof payload.email != "string" ||
            payload.domain != url.hostname
        ) {
            if (isPublicRoute(req.url)) {
                return handler(req);
            }

            const state = crypto.randomUUID();
            const authUrl = new URL(`https://${domain}/auth`);
            if (provider) {
                authUrl.searchParams.set("provider", provider);
            }
            authUrl.searchParams.set("client_id", clientID);
            authUrl.searchParams.set("redirect_uri", redirectUri);
            authUrl.searchParams.set("scope", "email");
            authUrl.searchParams.set("response_type", "code");
            authUrl.searchParams.set("state", state);

            const res = new Response(null, {
                status: 302,
                headers: {
                    Location: authUrl.toString(),
                },
            });
            deleteCookie(res.headers, JWT_COOKIE, cookieAttrs);
            setCookie(res.headers, {
                ...cookieAttrs,
                name: OAUTH_COOKIE,
                value: encodeURIComponent(
                    JSON.stringify(
                        {
                            state,
                            redirect: url.toString(),
                        },
                    ),
                ),
            });

            return res;
        }

        req.headers.set("X-LastLogin-Email", payload.email);
        if (isPublicRoute(req.url)) {
            return handler(req);
        }

        if (
            !verifyEmail(payload.email)
        ) {
            return new Response(
                "You do not have permission to access this page",
                {
                    status: 403,
                },
            );
        }

        return handler(req);
    };
}

export type JwtPayload = {
    [key: string]: unknown
    /**
     * The token is checked to ensure it has not expired.
     */
    exp?: number
    /**
     * The token is checked to ensure it is not being used before a specified time.
     */
    nbf?: number
    /**
     * The token is checked to ensure it is not issued in the future.
     */
    iat?: number
}

export type CreateTokenOptions = {
    /**
     * The secret key used to sign the JWT token.
     * It can also be passed using the LASTLOGIN_SECRET_KEY environment variable.
     */
    secretKey?: string;
}

export function createToken(payload: JwtPayload, options: CreateTokenOptions = {}): Promise<string> {
    const secretKey = options.secretKey || Deno.env.get("LASTLOGIN_SECRET_KEY");
    if (!secretKey) {
        throw new Error("Secret key is required");
    }

    return jwt.sign(payload, secretKey);
}
