import { Codejar } from "jsr:@pomdtr/smallweb-codejar@0.4.0";
import { lastlogin } from "jsr:@pomdtr/lastlogin@0.5.0";

const codejar = new Codejar("..");
export default {
    fetch: lastlogin(codejar.fetch),
};
