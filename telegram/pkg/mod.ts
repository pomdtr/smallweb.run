import { createCli } from "./cli.ts";
import { createServer } from "./server.ts";


export type TelegramOptions = {
    chatID?: string;
    botToken?: string;
    secretToken?: string;
    log?: boolean
};


export class Telegram {
    private server;
    private cli;

    constructor(opts: TelegramOptions = {}) {
        if (!Deno.env.get("SMALLWEB_ADMIN")) {
            throw new Error("Not an admin app");
        }

        const {
            chatID = Deno.env.get("TELEGRAM_CHAT_ID"),
            botToken = Deno.env.get("TELEGRAM_BOT_TOKEN"),
            secretToken = Deno.env.get("TELEGRAM_SECRET_TOKEN"),
            log
        } = opts;

        if (!botToken) {
            throw new Error(
                "botToken is required. Set it in the config or in the environment variable TELEGRAM_BOT_TOKEN",
            );
        }

        this.server = createServer({
            botToken,
            secretToken,
            log,
            chatID
        });

        this.cli = createCli({
            chatID,
            botToken,
            secretToken,
        });
    }

    fetch: (req: Request) => Response | Promise<Response> = (req) => {
        return this.server.fetch(req);
    };

    run: (args: string[]) => void | Promise<void> = (args) => {
        this.cli.parse(args, { from: "user" });
    };

}

