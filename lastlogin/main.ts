import { lastlogin } from "./mod.ts";

const handleRequest = () => {
    return new Response("Hello, world!");
}

export default {
    fetch: lastlogin(handleRequest)
}
