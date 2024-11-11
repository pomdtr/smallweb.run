import { lastlogin } from "jsr:@pomdtr/lastlogin@0.5.2";
import { Readme } from "./mod.ts";

const readme = new Readme({
    editorUrl: "https://editor.smallweb.run",
});

readme.fetch = lastlogin(readme.fetch);

export default readme;
