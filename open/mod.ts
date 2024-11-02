export async function open(url: string) {
    const command = new Deno.Command(Deno.build.os == "darwin" ? "open" : "xdg-open", {
        args: [url],
    })

    const { success } = await command.output()
    if (!success) {
        throw new Error("Failed to open URL")
    }
}
