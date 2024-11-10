import {
    type Cookie,
    deleteCookie,
    getCookies,
    setCookie,
} from "@std/http/cookie";
import { sign, verify } from "hono/jwt";

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
     * Indicates that all routes require authentication.
     */
    private?: boolean;

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

type FetchFn = (req: Request) => Response | Promise<Response>;

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
    next: FetchFn,
    options: LastLoginOptions = {},
): FetchFn {
    const isPublicRoute = (url: string) => {
        let isPublic = !options.private;
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

    const {
        domain = "lastlogin.io",
    } = options;

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
        // clone the request to modify it
        req = new Request(req);
        req.headers.delete("X-LastLogin-Email");

        const url = new URL(req.url);
        const clientID = `${url.protocol}//${url.host}/`;
        const redirectUri = `${url.protocol}//${url.host}/auth/callback`;
        if (url.pathname == "/auth/callback") {
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
            const jwt = await sign({
                email,
                exp,
            }, secretKey);

            deleteCookie(res.headers, OAUTH_COOKIE, cookieAttrs);
            setCookie(res.headers, {
                ...cookieAttrs,
                expires: new Date(exp * 1000),
                name: JWT_COOKIE,
                value: jwt,
            });

            return res;
        }

        if (url.pathname == "/auth/logout") {
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
        const jwt = await verify(cookies[JWT_COOKIE], secretKey).catch(() =>
            null
        );
        if (!jwt || !jwt.email || typeof jwt.email != "string") {
            if (isPublicRoute(req.url)) {
                return next(req);
            }

            const state = crypto.randomUUID();
            const authUrl = new URL(`https://${domain}/auth`);
            if (options.provider) {
                authUrl.searchParams.set("provider", options.provider);
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

        req.headers.set("X-LastLogin-Email", jwt.email);
        if (isPublicRoute(req.url)) {
            return next(req);
        }

        if (
            options.verifyEmail && !(await options.verifyEmail(jwt.email))
        ) {
            return new Response(
                "You do not have permission to access this page",
                {
                    status: 403,
                },
            );
        }

        return next(req);
    };
}
