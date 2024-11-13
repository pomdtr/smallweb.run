import { Embeds } from "jsr:@smallweb/embed@0.0.15/embed";

const embeds = new Embeds({
  "index.html": () => import("./_index.html.ts"),
});

export default embeds;