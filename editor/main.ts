import { Codejar } from "jsr:@pomdtr/smallweb-codejar@0.7.0";

const { SMALLWEB_DIR } = Deno.env.toObject();
const codejar = new Codejar({
    fsRoot: SMALLWEB_DIR,
});

export default codejar;
