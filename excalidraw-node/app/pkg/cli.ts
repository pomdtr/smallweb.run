import { Command } from "@commander-js/extra-typings"


export function createCli(rootDir: string) {
    const program = new Command()

    program.name("excalidraw")

    program.command("list")
        .alias("ls")
        .description("List all drawings")
        .action(() => {
            const entries = Deno.readDirSync(rootDir)
            for (const entry of entries) {
                console.log(entry.name)
            }
        })

    return program
}
