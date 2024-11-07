import { JSONFilePreset } from "npm:lowdb@7.0.1/node"
import { serveFile } from "jsr:@std/http"

const db = await JSONFilePreset("db.json", { emails: [] } as { emails: string[] })

export default {
    async fetch(req: Request) {
        const url = new URL(req.url)
        if (req.method === "POST") {
            const { email } = await req.json()
            if (db.data.emails.includes(email)) {
                return new Response("You are already on the waitlist!")
            }

            await db.update((data) => {
                data.emails.push(email)
            })

            return new Response("You have been added to the waitlist!")
        }

        if (url.pathname === "/readme") {
            return Response.redirect("https://readme.smallweb.run/cloud")
        }

        if (url.pathname === "/db.json") {
            return new Response(JSON.stringify(db.data, null, 2), {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }

        return serveFile(req, "index.html")
    },
    run() {
        console.log(JSON.stringify(db.data, null, 2))
    }
}

