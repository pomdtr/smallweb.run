import { program } from "npm:@commander-js/extra-typings"

export function createCli(params: {
    chatID?: string;
    botToken: string;
    secretToken?: string;
}) {
    const { SMALLWEB_APP_NAME, SMALLWEB_APP_URL } = Deno.env.toObject();

    program.name(SMALLWEB_APP_NAME)

    program.command("set-webhook").action(async () => {
        await fetch(`https://api.telegram.org/bot${params.botToken}/setWebhook`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: SMALLWEB_APP_URL,
                secret: params.secretToken,
            }),
        });
    })

    program.command("send").arguments("<text>").description(
        "Send a message to the bot",
    ).action(
        async (text) => {
            if (!params.chatID) {
                throw new Error("chatID is required");
            }

            await fetch(`https://api.telegram.org/bot${params.botToken}/sendMessage`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: params.chatID,
                    text,
                }),
            });
        },
    )

    return program
}
