export default {
    fetch: async () => {
        return new Response("Hello, world!")
    },
    run: (args: string[]) => {
        console.log("Hello, world!")
    }
}
