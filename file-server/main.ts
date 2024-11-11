import { FileServer } from "./mod.ts";

const fileServer = new FileServer({
    fsRoot: "./static",
    transpile: true,
    enableCors: true,
});

export default fileServer;
