import { Command } from "jsr:@cliffy/command@1.0.0-rc.7";
import { Hono } from "npm:hono@4.6.10"
import shlex from "npm:shlex"

export type TelegramOptions = {
    chatID?: string;
    botToken?: string;
    secretToken?: string;
};


export class Telegram {
    private server;
    private command;

    constructor(config: TelegramOptions = {}) {
        if (!Deno.env.get("SMALLWEB_ADMIN")) {
            throw new Error("Not an admin app");
        }

        const {
            chatID = Deno.env.get("TELEGRAM_CHAT_ID"),
            botToken = Deno.env.get("TELEGRAM_BOT_TOKEN"),
            secretToken = Deno.env.get("TELEGRAM_SECRET_TOKEN"),
        } = config;

        if (!chatID) {
            throw new Error(
                "chatID is required. Set it in the config or in the environment variable TELEGRAM_CHAT_ID",
            );
        }

        if (!botToken) {
            throw new Error(
                "botToken is required. Set it in the config or in the environment variable TELEGRAM_BOT_TOKEN",
            );
        }

        const SMALLWEB_CLI_PATH = Deno.env.get("SMALLWEB_CLI_PATH");
        if (!SMALLWEB_CLI_PATH) {
            throw new Error(
                "SMALLWEB_CLI_PATH is required. Set it in the environment variable SMALLWEB_CLI_PATH",
            );
        }

        this.server = createServer({ botToken, secretToken, chatID, cliPath: SMALLWEB_CLI_PATH });

        this.command = createCommand({
            chatID,
            botToken,
            secretToken,
        });
    }

    fetch: (req: Request) => Response | Promise<Response> = (req) => {
        return this.server.fetch(req);
    };

    run: (args: string[]) => void | Promise<void> = async (args) => {
        await this.command.parse(args);
    };
}

function createServer(params: { cliPath: string, chatID: string, botToken: string, secretToken?: string }) {
    return new Hono()
        .post("/webhook", async (c) => {
            if (params.secretToken && c.req.header("x-telegram-webhook-secret") !== params.secretToken) {
                return new Response("Invalid secret", { status: 401 });
            }

            const update = await c.req.json()
            if (!update.message) {
                return new Response("OK")
            }

            const text = update.message?.text;
            if (!text) {
                return
            }

            const args = shlex.split(text);
            const command = new Deno.Command(params.cliPath, {
                args,
            })
            const output = await command.output()

            const res = new TextDecoder().decode(output.code === 0 ? output.stdout : output.stderr)
            await fetch(`https://api.telegram.org/bot${params.botToken}/sendMessage`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: params.chatID,
                    text: res,
                }),
            });

            return new Response("OK")
        })
}

function createCommand(params: {
    chatID: string;
    botToken: string;
    secretToken?: string;
}) {
    const { SMALLWEB_APP_NAME, SMALLWEB_APP_URL } = Deno.env.toObject();

    const command = new Command().name(SMALLWEB_APP_NAME).action(
        () => {
            command.showHelp();
        },
    ).command("set-webhook").action(async () => {
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
    }).command("send").arguments("<text:string>").description(
        "Send a message to the bot",
    ).action(
        async (_, text) => {
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

    return command;
}
