import { Codejar } from "./mod.ts";
import { lastlogin } from "jsr:@pomdtr/lastlogin@0.5.2";

const codejar = new Codejar(".");

export default {
    fetch: lastlogin(codejar.fetch),
};
