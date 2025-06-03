import { Command } from "./mod.ts"

export const repo = new Command("repo", {}, (ctx) => {
    console.log(ctx.help())
})

repo.subcommand("list", {}, (_ctx) => {

})

repo.subcommand("add", {

}, (_ctx) => {

})
