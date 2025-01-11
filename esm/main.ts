const { SMALLWEB_APP_NAME } = Deno.env.toObject()

export default {
    fetch(req: Request) {
        const url = new URL(req.url)
        if (url.pathname === '/') {
            return Response.redirect(`https://raw.esm.sh/gh/pomdtr/smallweb.run/${SMALLWEB_APP_NAME}/main.ts`)
        }

        const [version, ...parts] = url.pathname.slice(1).split('/')
        if (version == "latest") {
            return Response.redirect(`https://raw.esm.sh/gh/pomdtr/smallweb.run/${parts.join('/')}`)
        }

        return Response.redirect(`https://raw.esm.sh/gh/pomdtr/smallweb.run@${version}/${parts.join('/')}`)
    }
}
