import { Embeds } from "jsr:@smallweb/embed@0.0.15/embed";

const embeds = new Embeds({
  "index.html": () => import("./_index.html.ts"),
  "manifest.json": () => import("./_manifest.json.ts"),
});

export default embeds;