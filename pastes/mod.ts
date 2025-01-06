import { serveDir } from "jsr:@std/http"
import { join } from "jsr:@std/path"

export type PastesOptions = {
    fsRoot?: string;
}


export class Pastes {

    constructor(public options: PastesOptions = {}) { }

    get fsRoot() {
        return this.options.fsRoot || "./data"
    }

    fetch = (req: Request) => {
        return serveDir(req, {
            fsRoot: this.fsRoot,
            showDirListing: true,
        })
    }

    run = async (args: string[]) => {
        if (Deno.stdin.isTerminal()) {
            console.error("No data piped to stdin")
            Deno.exitCode = 1
            return
        }

        const name = args[0] || Date.now().toString()

        const target = join(this.fsRoot, name)
        await Deno.writeFile(target, Deno.stdin.readable)
    }
}
