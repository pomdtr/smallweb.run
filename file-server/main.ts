import { FileServer } from "./mod.ts";

const fileServer = new FileServer({
    fsRoot: "./examples",
    showIndex: true,
    showDirListing: true,
    gfm: true,
    transpile: true,
    enableCors: true,
});

export default fileServer;
