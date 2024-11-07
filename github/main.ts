import { open } from "jsr:@smallweb/open@0.1.1"

export default {
    fetch: (req: Request) => {
        const url = new URL(req.url)
        if (url.pathname !== "/") {
            return Response.redirect(`https://github.com/pomdtr/smallweb.run/tree/main${url.pathname}`)
        }

        return Response.redirect("https://github.com/pomdtr/smallweb.run")
    },
    run: async (args: string[]) => {
        if (args.length == 0) {
            await open("https://github.com/pomdtr/smallweb.run")
            return
        }

        let filepath = args[0]
        if (!filepath.startsWith("/")) {
            filepath = `/${filepath}`
        }

        await open(`https://github.com/pomdtr/smallweb.run/tree/main${filepath}`)
    }
}
