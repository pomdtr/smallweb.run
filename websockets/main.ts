export async function handleRequest(request: Request) {
    if (request.headers.get("upgrade") === "websocket") {
        const { socket, response } = Deno.upgradeWebSocket(request);

        socket.onopen = () => {
            console.log("CONNECTED");
        };
        socket.onmessage = (event) => {
            console.log(`RECEIVED: ${event.data}`);
            socket.send("pong");
        };
        socket.onclose = () => console.log("DISCONNECTED");
        socket.onerror = (error) => console.error("ERROR:", error);

        return response;
    }

    // If the request is a normal HTTP request,
    // we serve the client HTML file.
    const file = await Deno.open("./index.html", { read: true });
    return new Response(file.readable);
}

export default {
    fetch: handleRequest,
};
