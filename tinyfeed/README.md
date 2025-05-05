# TinyFeed

Deno port of [TinyFeed](https://github.com/TheBigRoomXXL/tinyfeed).

## Usage in [smallweb](https://smallweb.run)

```ts
// $SMALLWEB_DIR/tinyfeed/main.ts
import { TinyFeed } from "jsr:@pomdtr/tinyfeed";

const tinyfeed = new TinyFeed({
    title: "TinyFeed Example",
    feeds: [
        "https://blog.smallweb.run/feed.xml",
        "https://deno.com/feed"
    ]
})

export default tinyfeed;
```

Then use `smallweb run tinyfeed` to generate the feed. You can automate the feed generation using a cron job:

```json
// $SMALLWEB_DIR/tinyfeed/smallweb.json
{
    "crons": [
        {
            "cron": "0 0 * * *",
            "args": []
        }
    ]
}
```
