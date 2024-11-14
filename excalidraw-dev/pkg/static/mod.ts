import { Embeds } from "jsr:@smallweb/embed@0.0.15/embed";

const embeds = new Embeds({
  "assets/index-BK_dGA4Y.js": () => import("./assets/_index-BK_dGA4Y.js.ts"),
  "assets/index-BPvgi06w.css": () => import("./assets/_index-BPvgi06w.css.ts"),
  "index.html": () => import("./_index.html.ts"),
});

export default embeds;