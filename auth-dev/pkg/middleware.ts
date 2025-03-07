type Handler = (req: Request) => Response | Promise<Response>;

import { createClient } from "@openauthjs/openauth/client";
import { getCookies, setCookie } from "@std/http/cookie";
import { subjects } from "./subjects.ts";

/**
 * Options for GitHub authentication middleware.
 */
export type GithubAuthOptions = {
  /** The issuer URL. */
  issuer: string;
  /** A list of authorized github usernames. */
  authorizedUsers?: string[];
  /** A list of authorized emails. */
  authorizedEmails?: string[];
};

export function githubAuth(opts: GithubAuthOptions, handler: Handler): Handler {
  const isAuthorized = (
    props: { username: string; email: string },
  ) => {
    if (
      !opts.authorizedEmails && !opts.authorizedUsers
    ) {
      return true;
    }

    const username = props.username.toLowerCase();
    if (
      opts.authorizedUsers &&
      opts.authorizedUsers.map((u) => u.toLowerCase()).includes(username)
    ) {
      return true;
    }

    if (
      opts.authorizedEmails &&
      opts.authorizedEmails.includes(props.email)
    ) {
      return true;
    }

    return false;
  };
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
      if (url.searchParams.has("error")) {
        const description = url.searchParams.get("error_description");
        return new Response(description, { status: 500 });
      }
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

    if (!isAuthorized(verified.subject.properties)) {
      return new Response("Unauthorized", { status: 403 });
    }

    const resp = await handler(
      new Request(req, {
        headers: {
          ...req.headers,
          "Remote-User": verified.subject.properties.username,
          "Remote-Email": verified.subject.properties.email,
        },
      }),
    );

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
