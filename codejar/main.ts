import { Codejar } from "./mod.ts";
import { lastlogin } from "jsr:@pomdtr/lastlogin@0.5.13";

const codejar = new Codejar();
codejar.fetch = lastlogin(codejar.fetch)

export default codejar
