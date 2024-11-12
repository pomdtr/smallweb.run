import { ValTown } from "npm:@valtown/sdk@0.23.0";
import { Command } from "jsr:@cliffy/command@1.0.0-rc.7";

const { SMALLWEB_APP_NAME } = Deno.env.toObject();

export default {
    async run(args: string[]) {
        const command = new Command().name(SMALLWEB_APP_NAME).version("0.1.0")
            .option(
                "-m, --message <message:string>",
                "The message to send",
                { required: true },
            ).action(async (options) => {
                const vt = new ValTown();
                await vt.emails.send({
                    text: options.message,
                });
            });

        await command.parse(args);
    },
};
