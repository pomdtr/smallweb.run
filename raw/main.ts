export default {
    fetch: (req: Request) => {
        const url = new URL(req.url);
        return fetch(`https://raw.githubusercontent.com/pomdtr/smallweb.run/refs/heads/main${url.pathname}`)
    }
}
