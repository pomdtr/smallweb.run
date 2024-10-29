/** @jsxImportSource hono/jsx */

import { html } from "hono/html";

export const style = html`
<style>
    :root {
        --color-text: #BFC7D5;
    }

    main {
        max-width: 820px;
        margin: 0 auto;
        padding-left: 10px;
        padding-right: 10px;
    }

    navbar {
        display: flex;
        flex-wrap: wrap;
        -moz-column-gap: 1rem;
        column-gap: 1rem;
        row-gap: 1rem;
        justify-content: space-between;
        padding: 2rem min(5vw, 5rem);
        align-items: center;
        font-family: 'Courier New', Courier, monospace;
        font-weight: 300;
    }

    .navbar-links {
        padding: 0;
        margin: 0;
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        -moz-column-gap: 1.5rem;
        column-gap: 1.5rem;
        align-items: center;
    }

    navbar a {
        text-decoration: none;
        color: var(--color-fg-default);
    }

    navbar a:hover {
        color: var(--color-fg-muted);
    }

    navbar svg {
        height: 0.75rem;
        margin-right: -8px;
    }

    .page-header {
        margin-bottom: var(--row-gap-medium);

        &>p:first-child {
            margin-top: 0;
        }
    }

    .article-header {
        margin-bottom: var(--row-gap-medium);
        text-align: center;
        margin-bottom: 3em;
        margin-top: 1.5em;
    }

    .title {
        border: none;
        font-size: 2.5em;
        font-family: lato;
    }

    .markdown-body {
        margin-bottom: 50px;
    }

    .markdown-body h1 {
        border: none;
    }

    .markdown-body h2 {
        border: none;
    }

    .index-header {
        text-align: center;
        margin-bottom: 3em;
        margin-top: 1.5em;
    }

    .index-title {
        font-size: 2.5em;
        font-weight: bold;
        font-family: lato;
    }

    .index-subtitle {
        font-size: 1.5em;
        width: 80%;
        margin: 0 auto;
        font-family: lato;
        font-weight: 300;
        color: var(--color-fg-muted);
    }

    .search-field {
        border: 1px solid var(--color-fg-muted);
        border-radius: 0.5em;
        padding: 0.8em;
        font-size: 1.1em;
        width: 75%;
        display: block;
        margin: 0 auto;
        margin-bottom: 4em;
        background-color: #2B2F42;
        color: var(--color-text);
    }
    
    .search-field::placeholder {
        color: #7B8092;
    }

    .no-articles {
        max-width: 500px;
        text-align: center;
        margin: auto;
        margin-top: 15vh;
        font-size: 1em;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
    }
    
    .no-articles .button {
        display: block;
        max-width: 300px;
        height: 25px;
        background: #4C527D;
        padding: 10px;
        text-align: center;
        border-radius: 5px;
        color: var(--color-text);
        font-weight: bold;
        line-height: 25px;
        margin: auto;
        margin-top: 30px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 
                    0 2px 4px rgba(0, 0, 0, 0.15);
        transition: box-shadow 0.3s ease, transform 0.2s ease;
        cursor: pointer;
        text-decoration: none;
    }
    
    .no-articles .button:hover {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25), 
                    0 4px 8px rgba(0, 0, 0, 0.2); /* Ombre plus intense au survol */
        transform: translateY(-2px); /* Effet de levée */
    }

    .no-articles .button:active {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15), 
                    0 1px 2px rgba(0, 0, 0, 0.1); /* Ombre plus discrète au clic */
        transform: translateY(1px); /* Enfoncement léger */
    }

    .articles-list {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .article-element {
        width: 100%;
        margin-bottom: 2em;
        color: var(--color-text);
    }

    .article-element hr {
        margin-top: 3em;
        width: 75%;
        color: rgba(132, 141, 151, 0.1);
        border-color: rgba(132, 141, 151, 0.1);
        background-color: rgba(132, 141, 151, 0.1);
    }

    .article-title {
        font-size: 1.5em;
        font-weight: bold;
        margin-bottom: 0em;
        margin-top: 0;
        font-family: lato;
    }

    .article-preview {
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
        margin: 0;
        font-weight: 300;
    }

    .article-element a,
    a:visited,
    a:active {
        /* color: var(--color-fg-muted); */
        color: var(--color-text);
        text-decoration: none;
    }

    .article-element a:hover {
        color: var(--color-fg-muted);
    }

    .article-element p {
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .metadata span {
        margin-right: 0.5em;
        font-style: italic;
        color: #91a0b1;
    }
    
    .article-element a:hover .metadata span {
        color: var(--color-fg-muted);
    }

    .metadata span::after {
        margin-left: 0.5em;
        content: "•";
    }

    .metadata span:last-child::after {
        content: "";
        margin-left: 0em;
    }

    .metadata .tag::after {
        content: "";
        margin-left: 0em;
    }

    .metadata .tag {
        font-family: monospace;
        font-style: normal;
        font-size: 1.1em;
        font-weight: 500;
    }

    .non-tag-metadata {
        font-family: lato;
        font-size: 0.9em;
    }

    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 2em;
        margin-bottom: 3em;
        font-size: 1.2em;
        font-weight: bold;
        font-family: lato;
    }

    .pagination-previous {
        margin-right: 0.5em;
        color: var(--color-text);
    }

    .pagination-next {
        margin-left: 0.5em;
        color: var(--color-text);
    }

    .markdown-body .highlight .token.keyword,
    .gfm-highlight .token.keyword {
        color: var(--color-prettylights-syntax-keyword)
    }

    .markdown-body .highlight .token.tag .token.class-name,
    .markdown-body .highlight .token.tag .token.script .token.punctuation,
    .gfm-highlight .token.tag .token.class-name,
    .gfm-highlight .token.tag .token.script .token.punctuation {
        color: var(--color-prettylights-syntax-storage-modifier-import)
    }

    .markdown-body .highlight .token.operator,
    .markdown-body .highlight .token.number,
    .markdown-body .highlight .token.boolean,
    .markdown-body .highlight .token.tag .token.punctuation,
    .markdown-body .highlight .token.tag .token.script .token.script-punctuation,
    .markdown-body .highlight .token.tag .token.attr-name,
    .gfm-highlight .token.operator,
    .gfm-highlight .token.number,
    .gfm-highlight .token.boolean,
    .gfm-highlight .token.tag .token.punctuation,
    .gfm-highlight .token.tag .token.script .token.script-punctuation,
    .gfm-highlight .token.tag .token.attr-name {
        color: var(--color-prettylights-syntax-constant)
    }

    .markdown-body .highlight .token.atrule,
    .gfm-highlight .token.atrule {
        color: var(--color-prettylights-syntax-keyword)
    }

    .markdown-body .highlight .token.punctuation,
    .gfm-highlight .token.punctuation,
    .markdown-body .highlight .token.function,
    .gfm-highlight .token.function {
        color: var(--color-prettylights-syntax-entity)
    }

    .markdown-body .highlight .token.string,
    .gfm-highlight .token.string {
        color: var(--color-prettylights-syntax-string)
    }

    .markdown-body .highlight .token.comment,
    .gfm-highlight .token.comment {
        color: var(--color-prettylights-syntax-comment)
    }

    .markdown-body .highlight .token.class-name,
    .gfm-highlight .token.class-name {
        color: var(--color-prettylights-syntax-variable)
    }

    .markdown-body .highlight .token.regex,
    .gfm-highlight .token.regex {
        color: var(--color-prettylights-syntax-string)
    }

    .markdown-body .highlight .token.regex .regex-delimiter,
    .gfm-highlight .token.regex .regex-delimiter {
        color: var(--color-prettylights-syntax-constant)
    }

    .markdown-body .highlight .token.tag .token.tag,
    .markdown-body .highlight .token.property,
    .gfm-highlight .token.tag .token.tag,
    .gfm-highlight .token.property {
        color: var(--color-prettylights-syntax-entity-tag)
    }

    .markdown-body .highlight .token.deleted,
    .gfm-highlight .token.deleted {
        color: var(--color-prettylights-syntax-markup-deleted-text);
        background-color: var(--color-prettylights-syntax-markup-deleted-bg)
    }

    .markdown-body .highlight .token.inserted,
    .gfm-highlight .token.inserted {
        color: var(--color-prettylights-syntax-markup-inserted-text);
        background-color: var(--color-prettylights-syntax-markup-inserted-bg)
    }
</style>
`;
