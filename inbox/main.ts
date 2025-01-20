import PostalMime from 'npm:postal-mime';
import { ensureDir } from "jsr:@std/fs"

export default {
    async email(data: ReadableStream<Uint8Array>) {
        await ensureDir("data");

        const msg = await PostalMime.parse(data);
        console.log(`Saving email from ${msg.from} to data/email.json`);
        await Deno.writeTextFile("data/email.json", JSON.stringify(msg, null, 4));
    }
}
