import lume from "lume/mod.ts";
import plugins from "./plugins.ts";
import "npm:prismjs@1.29.0/components/prism-json.js";
import "npm:prismjs@1.29.0/components/prism-bash.js";
import "npm:prismjs@1.29.0/components/prism-typescript.js";

const site = lume({
  src: "./src",
});

site.use(plugins());
site.copy("posts/img");

export default site;
