import shlex from "npm:shlex@2.1.2";
import * as path from "jsr:@std/path@1.0.6"
import { webhookCallback, Bot } from "npm:grammy"
import { Command } from "jsr:@cliffy/command@1.0.0-rc.7"
import * as html from "jsr:@std/html@1.0.0";

export type TelegramParams = {
    botToken: string;
    secretToken: string;
    smallwebApiToken: string;
    chatId: string;
    smallwebApiUrl: string;
}

export type App = {
    fetch(req: Request): Response | Promise<Response>;
    run(args: string[]): void | Promise<void>;
}

export function telegram(options?: Partial<TelegramParams>): App {
    const defaults: Partial<TelegramParams> = {
        botToken: Deno.env.get("TELEGRAM_BOT_TOKEN"),
        secretToken: Deno.env.get("TELEGRAM_BOT_SECRET"),
        chatId: Deno.env.get("TELEGRAM_CHAT_ID"),
        smallwebApiToken: Deno.env.get("SMALLWEB_API_TOKEN"),
        smallwebApiUrl: Deno.env.get("SMALLWEB_API_URL"),
    }

    const { botToken, secretToken, chatId, smallwebApiToken, smallwebApiUrl } = { ...defaults, ...options }
    if (!botToken) {
        throw new Error("botToken is required")
    }

    if (!chatId) {
        throw new Error("chatId is required")
    }

    if (!smallwebApiToken) {
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
        if (!ctx.message?.chat.id || ctx.message?.chat.id.toString() !== chatId) {
            await ctx.reply("You are not authorized to run commands")
            return
        }

        const [name, ...args] = shlex.split(ctx.match);
        const resp = await fetch(
            `${smallwebApiUrl}/v0/run/${name}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${smallwebApiToken}`,
                },
                body: JSON.stringify({ args }),
            },
        );

        if (!resp.ok) {
            await ctx.reply("Error running command: " + await resp.text());
            return
        }

        const output = await resp.text();
        if (output.length > 4096) {
            ctx.reply("Output is too long, go to your terminal to see the output");
            return
        }

        await ctx.reply(`<pre>${html.escape(output)}</pre>`, {
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
                await bot.api.setWebhook(globalThis.location.href);
            }).command("send").arguments("<text:string>").description("Send a message to the bot").action(
                async (_, text) => {
                    await bot.api.sendMessage(chatId, text);
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
