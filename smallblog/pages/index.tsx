/** @jsxImportSource hono/jsx */

import type { FC } from "hono/jsx";
import { Layout } from "./components/layout.tsx";
import type { Article } from "../blog.ts";
import { Articles } from "./components/articles.tsx";
import { html } from "hono/html";

type IndexProps = {
  posts: Article[];
  page: number;
  itemsPerPage: number;
  search: string;
  siteTitle: string;
  indexTitle?: string;
  indexSubtitle?: string;
  url: string;
  locale?: string;
  description?: string;
  noArticlesMessage?: string;
  bodyScript?: string;
  headScript?: string;
};

export const Index: FC<IndexProps> = (props: IndexProps) => {
  const {
    posts,
    siteTitle,
    indexTitle,
    indexSubtitle,
    bodyScript,
    headScript,
    url,
    locale,
    description,
    noArticlesMessage,
  } = props;

  return (
    <Layout
      pageTitle={siteTitle}
      siteTitle={siteTitle}
      bodyScript={bodyScript}
      headScript={headScript}
      url={url}
      locale={locale}
      description={description}
    >
      <header class={"index-header"}>
        {indexTitle && (
          <h1 class={"index-title"}>
            {indexTitle}
          </h1>
        )}
        {indexSubtitle && (
          <h2 class={"index-subtitle"}>
            {indexSubtitle}
          </h2>
        )}
      </header>
      <form action="/?page=1" method="get">
        <input
          class="search-field"
          id="search-field"
          type="search"
          name="search"
          placeholder="Search for specific articles..."
          hx-get="/?page=1"
          hx-trigger="input changed delay:500ms, search"
          hx-target=".articles-list"
          value={props.search}
        />
      </form>
      {posts && posts.length > 0 &&
        (
          <Articles
            posts={posts}
            search={props.search}
            page={props.page}
            itemsPerPage={props.itemsPerPage}
          />
        )}
      {(!posts || posts.length === 0) && (
        <div
          class="no-articles"
          dangerouslySetInnerHTML={{ __html: noArticlesMessage || "" }}
        />
      )}
      {
        /* This script fixes an issue with htmx boosting and the search field.
        In some conditions when you get back to the index page the searches value is
        not in the input field anymore. */
      }
      {html`
        <script>
          document.addEventListener('htmx:historyRestore', function () {
            const urlParams = new URLSearchParams(window.location.search);
            const paramValue = urlParams.get('search');

            if (paramValue) {
                const inputField = document.querySelector('input[name="search"]');
                if (inputField) {
                    inputField.value = paramValue;
                }
            }
          });
        </script>
      `}
    </Layout>
  );
};
