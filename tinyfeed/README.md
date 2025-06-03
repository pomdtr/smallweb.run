# Tinyfeed

Deno port of [tinyfeed](https://github.com/TheBigRoomXXL/tinyfeed).

## Usage in [smallweb](https://smallweb.run)

```ts
import { Tinyfeed } from "jsr:@pomdtr/tinyfeed";
import { createStorage } from "https://esm.sh/unstorage";
import fsDriver from "https://esm.sh/unstorage/drivers/fs";

const storage = createStorage({
    driver: fsDriver({ base: "./data" }),
});

const tinyfeed = new Tinyfeed({
    title: "Smallfeed",
    feeds: [
        "https://blog.smallweb.run/feed.xml",
        "https://blog.val.town/rss.xml",
    ],
    storage,
})

export default tinyfeed;
```

Then use `smallweb run tinyfeed` to generate the feed. You can automate the feed generation using a cron job:

```json
// $SMALLWEB_DIR/smallfeed/smallweb.json
{
    "crons": [
        {
            "cron": "0 0 * * *",
            "args": ["build"]
        }
    ]
}
```

## Usage in Val Town

See [https://val.town/v/pomdtr/tinyfeed](https://val.town/x/pomdtr/tinyfeed).
