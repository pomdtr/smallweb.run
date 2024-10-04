import { telegram } from "jsr:@smallweb/telegram"

export default telegram({
    chatId: parseInt(Deno.env.get("TELEGRAM_CHAT_ID")!),
    smallwebApiUrl: Deno.env.get("SMALLWEB_API_ENDPOINT")!,
    smallwebApiToken: Deno.env.get("SMALLWEB_API_TOKEN")!,
    botToken: Deno.env.get("TELEGRAM_BOT_TOKEN")!,
    secretToken: Deno.env.get("TELEGRAM_BOT_SECRET")!,
})
