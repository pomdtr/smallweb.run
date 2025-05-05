import { TinyFeed } from "jsr:@pomdtr/tinyfeed";

const tinyfeed = new TinyFeed({
    title: "TinyFeed",
    feeds: [
        "https://blog.smallweb.run/feed.xml",
        "https://deno.com/feed"
    ]
})

export default tinyfeed;
