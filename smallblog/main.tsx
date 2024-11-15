import { Smallblog } from "@tayzendev/smallblog";

const smallblog = new Smallblog(
    {
        postsFolder: "./data/posts",
        pagesFolder: "./data/pages",
        draftsFolder: "./data/drafts",
    }
)

export default smallblog;
