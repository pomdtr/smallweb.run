import * as ini from "jsr:@std/ini"

export default {
    fetch: async () => {
        const text = await Deno.readTextFile("data/example.url")
        const bookmark = await ini.parse(text)
        return Response.json(bookmark)
    }
}
