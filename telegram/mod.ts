import shlex from "npm:shlex@2.1.2";
import * as html from "jsr:@std/html@1.0.0";
import type { Update } from "npm:@grammyjs/types";
import * as path from "jsr:@std/path@1.0.6"
import { Command } from "jsr:@cliffy/command@1.0.0-rc.7"

export type TelegramParams = {
    botToken: string;
    secretToken?: string;
    smallwebApiToken: string;
    chatId: number;
    smallwebApiUrl: string;
}

export type App = {
    fetch(req: Request): Response | Promise<Response>;
    run(args: string[]): void | Promise<void>;
}

export function telegram(params: TelegramParams): App {
    const telegramApiUrl = `https://api.telegram.org/bot${params.botToken}`;
    if (!params.botToken) {
        throw new Error("telegram bot token is required");
    }

    if (!params.smallwebApiToken) {
        throw new Error("smallweb api token is required");
    }

    if (!params.smallwebApiUrl) {
        throw new Error("smallweb api url is required");
    }

    if (!params.chatId) {
        throw new Error("chat id is required");
    }

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
        if (secret !== params.secretToken) {
            return new Response("Unauthorized", { status: 401 });
        }

        const update: Update = await req.json();
        if (update.message?.chat.id !== params.chatId) {
            return new Response("Unauthorized", { status: 401 });
        }

        const text = update.message?.text;
        if (!text) {
            console.error("No text in message");
            return new Response("OK");
        }

        if (!update.message?.chat) {
            console.error("No chat in message");
            return new Response("OK");
        }

        const token = Deno.env.get("SMALLWEB_API_TOKEN");
        if (!token) {
            throw new Error("SMALLWEB_API_TOKEN is required");
        }

        if (!text.startsWith("/")) {
            sendMessage({
                apiURL: telegramApiUrl,
                text: "Commands must start with /",
                chatId: update.message.chat.id,
            });
            return new Response("ok");
        }

        const output = await runCommand(text.slice(1), token);
        if (output.length > 4096) {
            await sendMessage({
                apiURL: telegramApiUrl,
                text: "Output is too long, go to your terminal to see the output",
                chatId: update.message.chat.id,
            });
            return new Response();
        }
        await sendMessage({
            apiURL: telegramApiUrl,
            text: `<pre>${html.escape(output)}</pre>`,
            chatId: update.message.chat.id,
            parseMode: "HTML",
        });
        return new Response("OK");
    }

    const run = async (args: string[]) => {
        const name = path.basename(Deno.cwd());
        const commmand = new Command().name(name).action(() => {
            commmand.showHelp();
        }).command("set-webhook").action(async () => {
            await setWebhook(telegramApiUrl, params.secretToken);
        }).command("message").arguments("<text:string>").description("Send a message to the bot").action(
            async (_, text) => {
                await sendMessage({
                    apiURL: telegramApiUrl,
                    chatId: parseInt(Deno.env.get("TELEGRAM_CHAT_ID")!),
                    text,
                })
            }
        )
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
    const resp = await fetch(`${params.apiURL}/sendMessage`, {
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

    if (!resp.ok) {
        console.error(await resp.text());
    }
}

async function runCommand(command: string, token: string) {
    const [name, ...args] = shlex.split(command);
    if (!name) {
        return "No command provided";
    }
    const resp = await fetch(
        `${Deno.env.get("SMALLWEB_API_URL")}/run/${name}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ args }),
        },
    );

    if (!resp.ok) {
        return `Error: ${resp.status} ${await resp.text()}`;
    }

    return resp.text();
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
