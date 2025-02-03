type Handler = (req: Request) => Response | Promise<Response>;

import { createSubjects } from "npm:@openauthjs/openauth/subject";
import { array, object, string } from "npm:valibot";
import { createClient } from "npm:@openauthjs/openauth/client";
import { getCookies, setCookie } from "jsr:@std/http/cookie";
// @ts-types="npm:@types/ssh2"
import ssh from "npm:ssh2";
import { type } from "node:os";

const subjects = createSubjects({
    user: object({
        email: string(),
        keys: array(string()),
    }),
});

export type OpenAuthOptions = {
    issuer: string;
    authorizedKeys?: string | string[];
};

export function openauth(opts: OpenAuthOptions, handler: Handler): Handler {
    return async (req: Request) => {
        const url = new URL(req.url);
        const client = createClient({
            clientID: url.hostname,
            issuer: opts.issuer,
        });

        if (url.pathname == "/authorize") {
            const res = await client.authorize(
                url.origin + "/callback",
                "code",
            );
            return Response.redirect(res.url, 302);
        }

        if (url.pathname == "/callback") {
            const code = url.searchParams.get("code");
            if (!code) return new Response("Missing code", { status: 400 });
            const exchanged = await client.exchange(
                code,
                url.origin + "/callback",
            );
            if (exchanged.err) {
                return new Response(exchanged.err.toString(), {
                    status: 400,
                });
            }

            const resp = new Response(null, {
                status: 302,
                headers: {
                    Location: new URL("/", url.origin).toString(),
                },
            });

            setSession(
                resp.headers,
                exchanged.tokens.access,
                exchanged.tokens.refresh,
            );
            return resp;
        }

        const cookies = getCookies(req.headers);
        const verified = await client.verify(
            subjects,
            cookies.access_token,
            {
                refresh: cookies.refresh_token,
            },
        );
        if (verified.err) {
            console.error(verified.err);
            return Response.redirect(
                new URL("/authorize", url.origin).toString(),
                302,
            );
        }

        if (opts.authorizedKeys) {
            const authorizedKeysPaths = Array.isArray(opts.authorizedKeys)
                ? opts.authorizedKeys
                : [opts.authorizedKeys];

            if (
                await checkAuthorizedKeys(
                    authorizedKeysPaths,
                    verified.subject.properties.keys,
                )
            ) {
                return new Response("Unauthorized", { status: 401 });
            }
        }

        req.headers.set("X-User-Email", verified.subject.properties.email);
        const resp = await handler(req);
        if (verified.tokens) {
            setSession(
                resp.headers,
                verified.tokens.access,
                verified.tokens.refresh,
            );
        }
        return resp;
    };
}

async function checkAuthorizedKeys(
    authorizedKeysPaths: string[],
    publicKeys: string[],
) {
    for (const authorizedKeysPath of authorizedKeysPaths) {
        if (await checkPublicKeys(authorizedKeysPath, publicKeys)) {
            return true;
        }
    }

    return false;
}

async function checkPublicKeys(
    authorizedKeysPath: string,
    publicKeys: string[],
) {
    const parsedKeys = publicKeys.map((key) => ssh.utils.parseKey(key));
    const authorizedKeys = await Deno.readTextFile(authorizedKeysPath);

    for (const line of authorizedKeys.split("\n")) {
        if (!line) continue;
        if (line.startsWith("#")) continue;

        const authorizedKey = ssh.utils.parseKey(line);
        if (authorizedKey instanceof Error) {
            console.error(authorizedKey);
            continue;
        }

        for (const publicKey of parsedKeys) {
            if (publicKey instanceof Error) {
                console.error(authorizedKey);
                continue;
            }

            if (authorizedKey.getPublicPEM() === publicKey.getPublicPEM()) {
                return true;
            }
        }
    }

    return false;
}

function setSession(
    headers: Headers,
    accessToken?: string,
    refreshToken?: string,
) {
    if (accessToken) {
        setCookie(headers, {
            name: "access_token",
            value: accessToken,
            httpOnly: true,
            sameSite: "Lax",
            path: "/",
            maxAge: 34560000,
        });
    }
    if (refreshToken) {
        setCookie(headers, {
            name: "refresh_token",
            value: refreshToken,
            httpOnly: true,
            sameSite: "Lax",
            path: "/",
            maxAge: 34560000,
        });
    }
}
