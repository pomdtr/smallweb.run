export default {
    fetch: (req: Request) => {
        const url = new URL(req.url);
        const msg = url.searchParams.get("msg");
        if (!msg) {
            return new Response("No message", { status: 400 });
        }

        console.log(msg);
        return new Response("Message logged", { status: 200 });
    }
}
