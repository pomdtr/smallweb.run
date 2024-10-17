import { Command } from "jsr:@cliffy/command@1.0.0-rc.7"
import { webhookCallback, Bot } from "npm:grammy"
import * as html from "jsr:@std/html@1.0.0";
import * as path from "jsr:@std/path@1.0.6"
import shlex from "npm:shlex@2.1.2";
import { decodeBase64 } from "jsr:@std/encoding@1.0.5"
import type { App } from "jsr:@smallweb/types@0.1.0"


export type TelegramOptions = {
    botToken?: string;
    secretToken?: string;
    smallwebApiToken?: string;
    smallwebApiUrl?: string;
}

export function telegram(chatID: number, options?: TelegramOptions): App {
    const botToken = options?.botToken || Deno.env.get("TELEGRAM_BOT_TOKEN")
    if (!botToken) {
        throw new Error("botToken is required")
    }

    const secretToken = options?.secretToken || Deno.env.get("TELEGRAM_BOT_SECRET")
    if (!secretToken) {
        throw new Error("secretToken is required")
    }

    const apiUrl = options?.smallwebApiUrl || Deno.env.get("SMALLWEB_API_URL")
    if (!apiUrl) {
        throw new Error("smallwebApiUrl is required")
    }

    const apiToken = options?.smallwebApiToken || Deno.env.get("SMALLWEB_API_TOKEN")
    if (!apiToken) {
        throw new Error("smallwebApiToken is required")
    }

    const bot = new Bot(botToken)

    bot.command("start", async (ctx) => {
        await ctx.reply("Hello! I'm a bot that can run commands for you. Type /run <command> to run a command")
    })

    bot.command("help", async (ctx) => {
        await ctx.reply("Type /run <command> to run a command")
    })

    bot.command("run", async (ctx) => {
        if (!ctx.message?.chat.id || ctx.message?.chat.id !== chatID) {
            await ctx.reply("You are not authorized to run commands")
            return
        }

        const [name, ...args] = shlex.split(ctx.match);
        const resp = await fetch(
            `${apiUrl}/v0/run/${name}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${apiToken}`,
                },
                body: JSON.stringify({ args }),
            },
        );

        if (!resp.ok) {
            await ctx.reply("Error running command: " + await resp.text());
            return
        }

        const { stdout, stderr, success } = await resp.json();
        const text = new TextDecoder().decode(decodeBase64(success ? stdout : stderr));

        if (text.length > 4096) {
            ctx.reply("Output is too long, go to your terminal to see the output");
            return
        }

        await ctx.reply(`<pre>${html.escape(text)}</pre>`, {
            parse_mode: "HTML",
        });
    })


    const handleUpdate = webhookCallback(bot, "std/http", {
        secretToken: secretToken,
    })

    return {
        fetch: (req) => {
            if (req.method !== "POST") {
                return new Response("method not allowed", { status: 405 })
            }

            return handleUpdate(req)
        },
        run: async (args) => {
            const name = path.basename(Deno.cwd());
            const commmand = new Command().name(name).action(() => {
                commmand.showHelp();
            }).command("set-webhook").action(async () => {
                await bot.api.setWebhook(globalThis.location.href, {
                    secret_token: secretToken,
                });
            }).command("send").arguments("<text:string>").description("Send a message to the bot").action(
                async (_, text) => {
                    await bot.api.sendMessage(chatID, text);
                }
            ).command("set-my-commands").description("Register commands with the bot").action(async () => {
                await bot.api.setMyCommands([
                    { command: "start", description: "Start the bot" },
                    { command: "help", description: "Get help" },
                    { command: "run", description: "Run a command" },
                    { command: "list", description: "List apps" },
                ])
            })
            await commmand.parse(args);
        },
    }
}
