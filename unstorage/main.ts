import { createStorage } from "npm:unstorage@1.14.4";
import fsDriver from "npm:unstorage/drivers/fs";

export default {
    async run() {
        const storage = createStorage({
            driver: fsDriver({ base: "./data" }),
        });

        await storage.setItem("foo:bar", "baz");

        const item = await await storage.getItem("foo:bar");
        console.log(item);
    },
};
