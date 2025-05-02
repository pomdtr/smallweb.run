import PostalMime from "npm:postal-mime"
import { ensureDir } from "jsr:@std/fs"
import { Resend } from "npm:resend"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

export default {
    async email(msg: ReadableStream) {
        const email = await PostalMime.parse(msg)
        await ensureDir("./data")

        await resend.emails.send({
            from: "email@smallweb.run",
            to: email.from.address!,
            subject: "New email from " + email.from.address!,
            text: "You have received a new email from " + email.from.address!,
        })

        await Deno.writeTextFile(
            "./data/email.json",
            JSON.stringify(email, null, 2),
        )
    }
}
