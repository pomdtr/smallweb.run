import { Smallweb } from "./mod.ts";
import { getContext } from "jsr:@smallweb/ctx";

const { dir } = getContext();
const smallweb = new Smallweb(dir);

export default {
    async run() {
        console.log(await smallweb.app.list());
    },
};
