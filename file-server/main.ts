import { FileServer } from "./mod.ts";

const fileServer = new FileServer({
    fsRoot: "./static",
    transform: true,
    enableCors: true,
});

export default fileServer;
