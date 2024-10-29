/** @jsxImportSource hono/jsx */

import type { FC } from "hono/jsx";
import { Layout } from "./components/layout.tsx";
import type { Article } from "../blog.ts";
import { MetadataComponent } from "./components/metadata.tsx";

type ArticlePageProps = {
  article: Article;
  siteTitle: string;
  url: string;
  locale?: string;
  bodyScript?: string;
  headScript?: string;
};

export const ArticlePage: FC<ArticlePageProps> = (
  props: ArticlePageProps,
) => {
  const {
    article,
    siteTitle,
    bodyScript,
    headScript,
    locale,
    url,
  } = props;

  return (
    <Layout
      pageTitle={article.title}
      siteTitle={siteTitle}
      bodyScript={bodyScript}
      headScript={headScript}
      url={url}
      locale={locale}
      description={article.metadata?.description}
      article={article}
    >
      <header class={"article-header"}>
        <h1 class={"title"}>{article.title}</h1>
        <MetadataComponent article={article} />
      </header>
      <article
        dangerouslySetInnerHTML={{ __html: article.html }}
        class="markdown-body"
      />
    </Layout>
  );
};
