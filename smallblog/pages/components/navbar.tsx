/** @jsxImportSource hono/jsx */

import type { FC } from "hono/jsx";
import RssIcon from "./rss.tsx";

export const Navbar: FC<{ title: string }> = (props: { title: string }) => {
    return (
        <navbar hx-preserve="true">
            <a href="/" class="navbar-home" hx-boost="false">
                {props.title}
            </a>

            <ul class={"navbar-links"}>
                <li>
                    <a href="/rss.xml" hx-boost="false">
                        <RssIcon /> RSS
                    </a>
                </li>
            </ul>
        </navbar>
    );
};
