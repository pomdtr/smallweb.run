import { createClient } from "npm:@openauthjs/openauth@0.3.5/client"
import { object, string } from "npm:valibot@1.0.0-beta.11"
import { createSubjects } from "npm:@openauthjs/openauth/subject"

const subjects = createSubjects({
    user: object({
        email: string(),
    }),
})

export default {
    fetch: async (request: Request) => {
        const url = new URL(request.url)
        const client = createClient({
            clientID: url.hostname,
            issuer: "https://auth.smallweb.run",
        })

        const redirectURI = url.origin + "/callback"

        if (url.pathname == "/callback") {
            try {
                const code = url.searchParams.get("code")!
                const exchanged = await client.exchange(code, redirectURI)
                if (exchanged.err) throw new Error("Invalid code")
                const verifed = await client.verify(subjects, exchanged.tokens.access, {
                    refresh: exchanged.tokens.refresh,
                })

                if (verifed.err) throw new Error("Invalid token")

                return Response.json({ email: verifed.subject.properties.email })
            } catch (e) {
                return new Response((e as Error).message, { status: 500 })
            }
        }

        const res = await client.authorize(redirectURI, "code")
        return Response.redirect(
            res.url,
            302,
        )
    }
}
