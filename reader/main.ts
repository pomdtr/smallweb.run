import { Reader } from "./pkg/mod.ts";

const reader = new Reader({
    feeds: [
        "https://jvns.ca/atom.xml",
        "https://bower.sh/rss",
        "https://macwright.com/rss.xml",
        "https://blog.smallweb.run/feed.xml"
    ]
});

export default reader
