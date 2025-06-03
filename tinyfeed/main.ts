import { Tinyfeed } from "jsr:@pomdtr/tinyfeed";
import { createStorage } from "https://esm.sh/unstorage";
import fsDriver from "https://esm.sh/unstorage/drivers/fs-lite"

const storage = createStorage({
    driver: fsDriver({ base: "./data" }),
});

const tinyfeed = new Tinyfeed({
    title: "Smallfeed",
    feeds: [
        "https://blog.smallweb.run/feed.xml",
        "https://jvns.ca/atom.xml",
    ],
    storage,
})

export default tinyfeed;

