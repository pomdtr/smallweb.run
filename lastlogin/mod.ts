import { deleteCookie, getCookies, setCookie } from "@std/http/cookie";
import * as fs from "@std/fs"
import * as path from "@std/path"

type Session = {
    email: string;
    expiresAt: number;
}

function getSessionPath(sessionID: string) {
    return path.join(".lastlogin", "sessions", `${sessionID}.json`);
}

async function createSession(email: string) {
    const sessionID = crypto.randomUUID();
    const sessionPath = getSessionPath(sessionID);
    await fs.ensureDir(path.dirname(sessionPath));
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);
    const session: Session = {
        email,
        expiresAt: expiresAt.getTime(),
    };

    await Deno.writeTextFile(sessionPath, JSON.stringify(session));

    return sessionID;
}

async function getSession(sessionID: string): Promise<Session | null> {
    if (!sessionID) {
        return null;
    }

    const sessionPath = getSessionPath(sessionID);
    if (!await fs.exists(sessionPath)) {
        return null;
    }

    const session: Session = JSON.parse(await Deno.readTextFile(sessionPath));

    if (session.expiresAt < new Date().getTime()) {
        await deleteSession(sessionID);
        return null;
    }

    return session;
}

async function deleteSession(sessionID: string) {
    const sessionPath = getSessionPath(sessionID);
    if (await fs.exists(sessionPath)) {
        await Deno.remove(sessionPath);
    }
}

const SESSION_COOKIE = "lastlogin_session";
const OAUTH_COOKIE = "oauth_store";

export type LastLoginOptions = {
    dbPath?: string;
    verifyEmail?: (email: string) => Promise<boolean> | boolean;
    public?: boolean;
    provider?: string;
    public_routes?: string[];
    private_routes?: string[];
};

type FetchFn = (req: Request) => Response | Promise<Response>;


export function lastlogin(
    next: FetchFn,
    options: LastLoginOptions = {},
): FetchFn {
    const isPublicRoute = (url: string) => {
        let isPublic = !!options.public
        for (const pathname of options.private_routes ?? []) {
            const pattern = new URLPattern({ pathname });
            if (pattern.test(url)) {
                isPublic = false;
                break;
            }
        }

        for (const pathname of options.public_routes ?? []) {
            const pattern = new URLPattern({ pathname });
            if (pattern.test(url)) {
                isPublic = true;
            }
        }

        return isPublic;
    };

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

            const tokenUrl = new URL("https://lastlogin.net/token");
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

            const resp = await fetch("https://lastlogin.net/userinfo", {
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
            const sessionID = await createSession(email);
            deleteCookie(res.headers, OAUTH_COOKIE);
            setCookie(res.headers, {
                httpOnly: true,
                secure: true,
                sameSite: "Lax",
                path: "/",
                name: SESSION_COOKIE,
                value: sessionID,
            });

            return res;
        }

        if (url.pathname == "/auth/logout") {
            const cookies = getCookies(req.headers);
            if (!(SESSION_COOKIE in cookies)) {
                return new Response("session cookie not found", { status: 401 });
            }
            const sessionID = cookies[SESSION_COOKIE];
            await deleteSession(sessionID);

            const res = new Response(null, {
                status: 302,
                headers: {
                    Location: "/",
                },
            });

            deleteCookie(res.headers, SESSION_COOKIE);
            return res;
        }

        const cookies = getCookies(req.headers);
        const session = await getSession(cookies[SESSION_COOKIE]);
        if (!session) {
            if (isPublicRoute(req.url)) {
                return next(req);
            }

            const state = crypto.randomUUID();
            const authUrl = new URL("https://lastlogin.net/auth");
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
            deleteCookie(res.headers, SESSION_COOKIE);
            setCookie(res.headers, {
                httpOnly: true,
                secure: true,
                sameSite: "Lax",
                path: "/",
                name: OAUTH_COOKIE,
                value: encodeURIComponent(
                    JSON.stringify({
                        state,
                        redirect: url.toString(),
                    }),
                ),
            });

            return res;
        }


        if (isPublicRoute(req.url)) {
            return next(req);
        }

        if (options.verifyEmail && !(await options.verifyEmail(session.email))) {
            return new Response("You do not have permission to access this page", {
                status: 403,
            });
        }

        req.headers.set("X-LastLogin-Email", session.email);
        return next(req);
    };
}
