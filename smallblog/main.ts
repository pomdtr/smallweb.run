import { Smallblog } from "jsr:@tayzendev/smallblog@1.2.0";

export default new Smallblog({
    siteTitle: "Smallblog",
    nav: [
        { text: "Home", href: "/" },
        { text: "About", href: "/about" },
        { text: "Github", href: "https://github.com/tayzendev/smallblog" },
        { text: "RSS", href: "/feed.xml" }
    ]
});
