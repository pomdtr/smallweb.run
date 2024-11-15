import { Smallblog } from "jsr:@tayzendev/smallblog@1.0.1";

const smallblog = new Smallblog(
    {
        postsFolder: "./data/posts",
        pagesFolder: "./data/pages",
        draftsFolder: "./data/drafts",
    }
)

export default smallblog;
