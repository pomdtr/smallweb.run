import { Codejar } from "jsr:@pomdtr/smallweb-codejar@0.4.0";
import { lastlogin } from "jsr:@pomdtr/lastlogin@0.5.2";

const { SMALLWEB_DIR } = Deno.env.toObject();
const codejar = new Codejar(SMALLWEB_DIR);

export default {
    fetch: lastlogin(codejar.fetch),
};
