import { FileServer } from "jsr:@smallweb/file-server@0.5.9";

const fileServer = new FileServer({
    fsRoot: "./markdown",
    showIndex: true,
    gfm: true,
});

export default fileServer;
