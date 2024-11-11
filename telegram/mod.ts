import { Command } from "jsr:@cliffy/command@1.0.0-rc.7";
import { Bot, webhookCallback } from "npm:grammy@1.31.1";

export type TelegramConfig = {
    chatID: string;
    botToken?: string;
    secretToken?: string;
    smallwebApiToken?: string;
    smallwebApiUrl?: string;
};

interface App {
    fetch: (req: Request) => Response | Promise<Response>;
    run?: (args: string[]) => void | Promise<void>;
}

export class Telegram implements App {
    private handler;
    private command;

    constructor(config: TelegramConfig) {
        const {
            chatID,
            botToken = Deno.env.get("TELEGRAM_BOT_TOKEN"),
            secretToken,
        } = config;
        if (!botToken) {
            throw new Error(
                "botToken is required. Set it in the config or in the environment variable TELEGRAM_BOT_TOKEN",
            );
        }

        const bot = createBot({ botToken });

        this.handler = webhookCallback(bot, "std/http", {
            secretToken: secretToken,
        });

        this.command = createCommand({
            bot,
            chatID,
            secretToken,
        });
    }

    fetch: (req: Request) => Response | Promise<Response> = (req) => {
        return this.handler(req);
    };

    run: (args: string[]) => void | Promise<void> = async (args) => {
        await this.command.parse(args);
    };
}

function createBot(params: { botToken: string }) {
    const bot = new Bot(params.botToken);

    bot.command("start", async (ctx) => {
        await ctx.reply(
            "Hello! I'm a bot that can run commands for you. Type /run <command> to run a command",
        );
    });

    return bot;
}

function createCommand(params: {
    bot: Bot;
    chatID: string;
    secretToken?: string;
}) {
    const { SMALLWEB_APP_NAME, SMALLWEB_APP_URL } = Deno.env.toObject();

    const command = new Command().name(SMALLWEB_APP_NAME).action(
        () => {
            command.showHelp();
        },
    ).command("set-webhook").action(async () => {
        await params.bot.api.setWebhook(SMALLWEB_APP_URL, {
            secret_token: params.secretToken,
        });
    }).command("send").arguments("<text:string>").description(
        "Send a message to the bot",
    ).action(
        async (_, text) => {
            await params.bot.api.sendMessage(params.chatID, text);
        },
    ).command("set-my-commands").description(
        "Register commands with the bot",
    ).action(async () => {
        await params.bot.api.setMyCommands([
            { command: "start", description: "Start the bot" },
            { command: "help", description: "Get help" },
            { command: "run", description: "Run a command" },
            { command: "list", description: "List apps" },
        ]);
    });

    return command;
}
