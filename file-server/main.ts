import { FileServer } from "./mod.ts";

export default new FileServer({
    fsRoot: "./static",
    transform: true,
});
