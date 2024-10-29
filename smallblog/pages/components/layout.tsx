/** @jsxImportSource hono/jsx */

import type { Child, FC } from "hono/jsx";
import { CSS } from "@deno/gfm";
import { Navbar } from "./navbar.tsx";
import { style } from "../style.ts";
import type { Article } from "../../blog.ts";

type LayoutProps = {
    children: Child;
    pageTitle: string;
    siteTitle: string;
    bodyScript?: string;
    headScript?: string;
    url: string;
    description?: string;
    article?: Article;
    locale?: string;
};

export const Layout: FC<LayoutProps> = (
    props: LayoutProps,
) => {
    const {
        children,
        pageTitle,
        siteTitle,
        bodyScript,
        headScript,
        url,
        description,
        article,
        locale,
    } = props;

    return (
        <html lang="en">
            <head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta charset="UTF-8" hx-preserve="true" />
                <style hx-preserve="true">{CSS}</style>
                {style}
                <link
                    href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap"
                    rel="preconnect preload stylesheet"
                    as="style"
                    hx-preserve="true"
                >
                </link>
                <noscript hx-preserve="true">
                    <style>{".js-only { display: none }"}</style>
                </noscript>
                <script
                    src="https://unpkg.com/htmx.org@2.0.3/dist/htmx.min.js"
                    rel="preconnect preload"
                    hx-preserve="true"
                    defer
                />
                <script
                    src="https://unpkg.com/htmx-ext-head-support@2.0.3/head-support.js"
                    rel="preconnect preload"
                    hx-preserve="true"
                    defer
                />
                <title>{pageTitle}</title>
                {/* SEO Section */}
                <meta
                    name="generator"
                    property="generator"
                    content="smallblog"
                    hx-preserve="true"
                />
                {locale &&
                    (
                        <meta
                            name="og:locale"
                            property="og:locale"
                            content={locale}
                            hx-preserve="true"
                        />
                    )}
                <meta
                    name="og:site_name"
                    property="og:site_name"
                    content={siteTitle}
                    hx-preserve="true"
                />
                <meta name="og:title" property="og:title" content={pageTitle} />
                <meta
                    name="twitter:title"
                    property="twitter:title"
                    content={pageTitle}
                />
                <meta name="og:url" property="og:url" content={url} />
                {description && (
                    <>
                        <meta
                            name="description"
                            property="description"
                            content={description}
                        />
                        <meta
                            name="og:description"
                            property="og:description"
                            content={description}
                        />
                        <meta
                            name="twitter:description"
                            property="twitter:description"
                            content={description}
                        />
                    </>
                )}
                {!article && (
                    <>
                        <meta
                            name="og:type"
                            property="og:type"
                            content="website"
                        />
                        <meta
                            name="revisit-after"
                            property="revisit-after"
                            content="1 day"
                        />
                    </>
                )}
                {article && (
                    <>
                        <meta
                            name="og:type"
                            property="og:type"
                            content="article"
                        />
                        {article.metadata?.section &&
                            (
                                <meta
                                    name="article:section"
                                    property="article:section"
                                    content={article.metadata.section}
                                />
                            )}
                        {article.metadata?.date && (
                            <meta
                                name="article:published_time"
                                property="article:published_time"
                                content={article.metadata.date.toISOString()}
                            />
                        )}
                        {article.metadata.authors?.map(
                            (username) => (
                                <>
                                    <meta
                                        name="article:author"
                                        property="article:author"
                                        content={username}
                                    />
                                    <meta
                                        name="author"
                                        property="author"
                                        content={username}
                                    />
                                </>
                            ),
                        )}
                        {article.metadata.tags?.map(
                            (tag) => (
                                <meta
                                    name="article:tag"
                                    property="article:tag"
                                    content={tag}
                                />
                            ),
                        )}
                        <meta
                            name="revisit-after"
                            property="revisit-after"
                            content="7 days"
                        />
                    </>
                )}
                <meta
                    name="robots"
                    property="robots"
                    content="index, follow"
                    hx-preserve="true"
                />
                {/* End of SEO Section */}
                <link rel="icon" type="image/x-icon" href="/favicon" />
                {headScript}
            </head>
            <body
                data-color-mode="dark"
                data-light-theme="light"
                data-dark-theme="dark"
                hx-ext="head-support"
                hx-boost="true"
                style="background-color: #27293C; color: #BFC7D5;"
            >
                {bodyScript}
                <Navbar title={siteTitle} />
                <main>
                    {children}
                </main>
            </body>
        </html>
    );
};
