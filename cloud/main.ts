import { JSONFilePreset } from "npm:lowdb@7.0.1/node";
import { serveFile } from "jsr:@std/http";
import { Resend } from "npm:resend@4.0.1";
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
        if (!email) {
            return new Response("Email is required!", { status: 400 });
        }

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
                text:
                    `A new user with the email ${email} has joined the waitlist!`,
            });
        } catch (e) {
            console.error(e);
        }

        return new Response("You have been added to the waitlist!");
    }

    if (url.pathname === "/readme") {
        return Response.redirect("https://readme.smallweb.run/cloud");
    }

    return serveFile(req, "index.html");
};

export default {
    fetch: handleRequest,
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
