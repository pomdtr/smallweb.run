import { JSONFilePreset } from "npm:lowdb@7.0.1/node";
import { serveFile } from "jsr:@std/http";
import { lastlogin } from "jsr:@pomdtr/lastlogin@0.2.6";

type Data = {
    emails: string[];
};

const handleRequest = async (req: Request) => {
    const url = new URL(req.url);
    if (req.method === "POST") {
        const { email } = await req.json();

        const db = await JSONFilePreset<Data>("db.json", { emails: [] });
        if (db.data.emails.includes(email)) {
            return new Response("You are already on the waitlist!");
        }
        await db.update((data) => {
            data.emails.push(email);
        });

        return new Response("You have been added to the waitlist!");
    }

    if (url.pathname === "/db.json") {
        return serveFile(req, "db.json");
    }

    if (url.pathname === "/readme") {
        return Response.redirect("https://readme.smallweb.run/cloud");
    }

    return serveFile(req, "index.html");
};

export default {
    fetch: lastlogin(handleRequest, {
        verifyEmail: (email) => {
            return email === Deno.env.get("EMAIL");
        },
        private_routes: ["/db.json"],
    }),
    async run() {
        const db = await JSONFilePreset<Data>("db.json", { emails: [] });
        console.log(JSON.stringify(db.data, null, 2));
    },
};
