import lume from "lume/mod.ts";
import blog from "blog/mod.ts";
import extractDate from "lume/plugins/extract_date.ts";

const site = lume({
    location: new URL("https://blog.smallweb.run/"),
});

site.use(extractDate())
site.use(blog());
site.add("posts/img")

export default site;
