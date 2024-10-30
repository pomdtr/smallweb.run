import { parseArgs } from "jsr:@std/cli"

function run() {
    const flags = parseArgs(Deno.args)

    const { _: params, ...options } = flags

    const pathname = params.join("/")

    const request = new Request()
}

