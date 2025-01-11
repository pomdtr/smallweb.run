const { SMALLWEB_APP_NAME } = Deno.env.toObject()

export default {
    fetch(req: Request) {
        const url = new URL(req.url)
        if (url.pathname === '/') {
            return Response.redirect(`https://raw.esm.sh/gh/pomdtr/smallweb.run/${SMALLWEB_APP_NAME}/main.ts`)
        }

        return Response.redirect(`https://raw.esm.sh/gh/pomdtr/smallweb.run${url.pathname}`)
    }
}
