import { Context, Hono } from "npm:hono"
import { getCookie, setCookie } from "npm:hono/cookie"
import { createClient } from "npm:@openauthjs/openauth/client"
import { createSubjects } from "npm:@openauthjs/openauth/subject"

import {object, string, array} from "npm:valibot"

const subjects = createSubjects({
    user: object({
        email: string(),
        keys: array(string()),
    }),
})

const { SMALLWEB_APP_URL } = Deno.env.toObject()

const client = createClient({ clientID: SMALLWEB_APP_URL, issuer: "https://auth.smallweb.run" })

const app = new Hono()
  .get("/authorize", async (c) => {
    const origin = new URL(c.req.url).origin
    const { url } = await client.authorize(origin + "/callback", "code")
    return c.redirect(url, 302)
  })

  .get("/callback", async (c) => {
    const origin = new URL(c.req.url).origin
    try {
      const code = c.req.query("code")
      if (!code) throw new Error("Missing code")
      const exchanged = await client.exchange(code, origin + "/callback")
      if (exchanged.err)
        return new Response(exchanged.err.toString(), {
          status: 400,
        })
      setSession(c, exchanged.tokens.access, exchanged.tokens.refresh)
      return c.redirect("/", 302)
    } catch (e: any) {
      return new Response(e.toString())
    }
  })
  .get("/", async (c) => {
    const access = getCookie(c, "access_token")
    const refresh = getCookie(c, "refresh_token")
    try {
      const verified = await client.verify(subjects, access!, {
        refresh,
      })
      if (verified.err) throw new Error("Invalid access token")
      if (verified.tokens)
        setSession(c, verified.tokens.access, verified.tokens.refresh)
      return c.json(verified.subject)
    } catch (e) {
      console.error(e)
      return c.redirect("/authorize", 302)
    }
  })

function setSession(c: Context, accessToken?: string, refreshToken?: string) {
  if (accessToken) {
    setCookie(c, "access_token", accessToken, {
      httpOnly: true,
      sameSite: "Strict",
      path: "/",
      maxAge: 34560000,
    })
  }
  if (refreshToken) {
    setCookie(c, "refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      path: "/",
      maxAge: 34560000,
    })
  }
}

export default app
