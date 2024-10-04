export default {
    fetch: (req: Request) => {
        const url = new URL(req.url)
        if (url.pathname !== "/") {
            return Response.redirect(`https://github.com/pomdtr/smallweb.run/tree/main${url.pathname}`)
        }

        return Response.redirect("https://github.com/pomdtr/smallweb.run")
    }
}
