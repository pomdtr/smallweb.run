import { Smallfeed } from "./pkg/mod.ts"

const smallfeed = new Smallfeed({
    feeds: [
        "https://korben.info/feed"
    ]
})

export default smallfeed
