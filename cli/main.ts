import { Command } from "./mod.ts"
import { repo } from "./repo.ts"

const command = new Command("tweety [yolo]", {
    subcommands: [repo],
}, (ctx) => {
    console.log(ctx.flag("flag"))
})

if (import.meta.main) {
    await command.run(Deno.args);
}

