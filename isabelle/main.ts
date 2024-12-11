import { lastlogin } from "jsr:@pomdtr/lastlogin@0.5.13"

export default {
    fetch: lastlogin(() => new Response("Hey!")),
}
