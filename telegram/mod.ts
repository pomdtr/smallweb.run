import shlex from "npm:shlex@2.1.2";
import * as html from "jsr:@std/html@1.0.0";
import type { Update } from "npm:@grammyjs/types";
import * as path from "jsr:@std/path@1.0.6"
import { Command } from "jsr:@cliffy/command@1.0.0-rc.7"

export type TelegramOptions = {
    botToken: string;
    secretToken?: string;
    smallwebApiToken: string;
    handler?: (update: Update) => void | Promise<void>;
    chatId: string;
    smallwebApiUrl: string;
}

export type App = {
    fetch(req: Request): Response | Promise<Response>;
    run(args: string[]): void | Promise<void>;
}

export function telegram(options?: TelegramOptions): App {
    const defaults: Partial<TelegramOptions> = {
        botToken: Deno.env.get("TELEGRAM_BOT_TOKEN"),
        secretToken: Deno.env.get("TELEGRAM_BOT_SECRET"),
        chatId: Deno.env.get("TELEGRAM_CHAT_ID"),
        smallwebApiToken: Deno.env.get("SMALLWEB_API_TOKEN"),
        smallwebApiUrl: Deno.env.get("SMALLWEB_API_URL"),
    }

    const {
        botToken,
        secretToken,
        chatId,
        smallwebApiToken,
        smallwebApiUrl,
    } = { ...defaults, ...options };

    if (!botToken) {
        throw new Error("telegram bot token is required");
    }

    if (!smallwebApiToken) {
        throw new Error("smallweb api token is required");
    }

    if (!smallwebApiUrl) {
        throw new Error("smallweb api url is required");
    }

    if (!chatId) {
        throw new Error("chat id is required");
    }

    const telegramApiUrl = `https://api.telegram.org/bot${botToken}`;
    const fetch = async (req: Request) => {

        if (req.method === "GET") {
            const url = new URL(req.url);
            if (url.pathname === "/favicon.ico") {
                return new Response(null, { status: 404 });
            }

            const content = Deno.readFileSync("main.ts");
            return new Response(content, {
                headers: {
                    "Content-Type": "text/typescript",
                },
            });
        }

        const secret = req.headers.get("X-Telegram-Bot-Api-Secret-Token");
        if (secret !== secretToken) {
            return new Response("Unauthorized", { status: 401 });
        }

        const update: Update = await req.json();

        const text = update.message?.text;
        if (!text) {
            console.error("No text in message");
            return new Response("OK");
        }

        if (!update.message?.chat.id) {
            console.error("No chat id in message");
            return new Response("OK");
        }


        if (update.message.chat.id != parseInt(chatId)) {
            return new Response("Unauthorized", { status: 401 });
        }

        const token = Deno.env.get("SMALLWEB_API_TOKEN");
        if (!token) {
            throw new Error("SMALLWEB_API_TOKEN is required");
        }

        const resp = await runCommand(text, token);
        if (!resp.ok) {
            await sendMessage({
                apiURL: telegramApiUrl,
                text: "Error running command: " + await resp.text(),
                chatId: parseInt(chatId)
            });
            return new Response("OK");
        }

        const output = await resp.text();
        if (output.length > 4096) {
            await sendMessage({
                apiURL: telegramApiUrl,
                text: "Output is too long, go to your terminal to see the output",
                chatId: parseInt(chatId)
            });
            return new Response("OK");
        }

        await sendMessage({
            apiURL: telegramApiUrl,
            text: `<pre>${html.escape(output)}</pre>`,
            chatId: parseInt(chatId),
            parseMode: "HTML",
        });
        return new Response("OK");
    }

    const run = async (args: string[]) => {
        const name = path.basename(Deno.cwd());
        const commmand = new Command().name(name).action(() => {
            commmand.showHelp();
        }).command("set-webhook").action(async () => {
            await setWebhook(telegramApiUrl, secretToken);
        }).command("send").arguments("<text:string>").description("Send a message to the bot").action(
            async (_, text) => {
                await sendMessage({
                    apiURL: telegramApiUrl,
                    chatId: parseInt(chatId),
                    text,
                })
            }
        ).command("set-my-commands").description("Register commands with the bot").action(async () => {
            const resp = await registerCommands(telegramApiUrl);
            if (!resp.ok) {
                console.error("Error registering commands", await resp.text());
                Deno.exit(1);
            }

            console.log("Commands registered!");
        })
        await commmand.parse(args);
    }

    return {
        fetch,
        run
    }
}

async function sendMessage(params: {
    apiURL: string;
    text: string;
    chatId: number;
    parseMode?: string;
}) {
    return await fetch(`${params.apiURL}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            parse_mode: params.parseMode,
            chat_id: params.chatId,
            text: params.text,
        }),
    });
}

async function runCommand(command: string, token: string) {
    const [name, ...args] = shlex.split(command);
    return await fetch(
        `${Deno.env.get("SMALLWEB_API_URL")}/v0/run/${name}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ args }),
        },
    );
}

async function setWebhook(apiURL: string, secretToken?: string) {
    await fetch(`${apiURL}/setWebhook`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            url: globalThis.location.href,
            secretToken,
        }),
    });
}

async function registerCommands(apiURL: string) {
    return await fetch(`${apiURL}/setMyCommands`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            commands: [
                { command: "help", description: "Get help" },
                { command: "run", description: "Run a command" },
                { command: "list", description: "List apps" },
            ],
        }),
    });
}
