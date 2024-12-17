import { JSONFilePreset } from "npm:lowdb@7.0.1/node";
import { serveFile } from "jsr:@std/http";
import { lastlogin } from "jsr:@pomdtr/lastlogin@0.5.2";
import { Resend } from "npm:resend@4.0.1"
import * as cli from "jsr:@std/cli";

const { EMAIL, RESEND_API_KEY } = Deno.env.toObject();
const resend = new Resend(RESEND_API_KEY);
type Data = {
    emails: string[];
};

const db = await JSONFilePreset<Data>("data/db.json", { emails: [] });

const handleRequest = async (req: Request) => {
    const url = new URL(req.url);
    if (req.method === "POST") {
        const { email } = await req.json();
        if (db.data.emails.includes(email)) {
            return new Response("You are already on the waitlist!");
        }
        await db.update((data) => {
            data.emails.push(email);
        });

        try {
            await resend.emails.send({
                from: "Smallweb Cloud <cloud@smallweb.run>",
                to: EMAIL,
                subject: "A new user has joined the waitlist!",
                text: `A new user with the email ${email} has joined the waitlist!`,
            })
        } catch (e) {
            console.error(e);
        }

        return new Response("You have been added to the waitlist!");
    }

    if (url.pathname === "/db.json") {
        return serveFile(req, "data/db.json");
    }

    if (url.pathname === "/readme") {
        return Response.redirect("https://readme.smallweb.run/cloud.md");
    }

    return serveFile(req, "index.html");
};

export default {
    fetch: lastlogin(handleRequest, {
        public: true,
        privateRoutes: ["/db.json"],
    }),
    run(args: string[]) {
        const flags = cli.parseArgs(args, {
            boolean: ["json"],
        });

        if (flags.json) {
            console.log(JSON.stringify(db.data, null, 2));
            return;
        }

        for (const email of db.data.emails) {
            console.log(email);
        }
    },
};
