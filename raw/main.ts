export default {
    fetch: (req: Request) => {
        const url = new URL(req.url);
        return Response.redirect(`https://raw.githubusercontent.com/pomdtr/smallweb.run/refs/heads/main${url.pathname}`);
    }
}
