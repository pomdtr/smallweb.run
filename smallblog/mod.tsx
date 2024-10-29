/** @jsxImportSource hono/jsx */
import * as path from "@std/path";
import * as fs from "@std/fs";
import { contentType } from "@std/media-types";
import { type Context, Hono } from "hono";
import { cache } from "hono/cache";
import { compress } from "hono/compress";
import { Index } from "./pages/index.tsx";
import {
  filterArticlesFTS,
  getArticle,
  getArticles,
  getRSS,
  getSitemap,
} from "./blog.ts";
import { isDirectoryEmpty } from "./utils.ts";
import { ArticlePage } from "./pages/article.tsx";
import { Articles } from "./pages/components/articles.tsx";
import type { App } from "@smallweb/types";
import { storeArticle } from "./article_generator.ts";
import { generateCli } from "./cli.ts";

/**
 * The options to create your blog.
 */
export type SmallblogOptions = {
  /** The folder where your posts are located (default: `posts/`). */
  postsFolder?: string;
  /** The folder where your drafts are located (default: `drafts/`). */
  draftsFolder?: string;
  /** The path to your favicon (default: `favicon.ico`). */
  faviconPath?: string;
  /** The title of your blog (default: `Smallblog`). */
  siteTitle?: string;
  /** The description of your blog (default: `The blog: ${siteTitle}`). */
  siteDescription?: string;
  /** The title of the index page (ex: `A blog about nothing`, no default). */
  indexTitle?: string;
  /** The subtitle of the index page (ex: `A nice demo of smallblog`, no default). */
  indexSubtitle?: string;
  /** The message to display when there are no articles (ex: `Coming soon!`, default is a message to help you). */
  noArticlesMessage?: string;
  /** The locale of your blog. */
  locale?: string;
  /** The script to add to the header of your blog. */
  customHeaderScript?: string;
  /** The script to add to the body of your blog. */
  customBodyScript?: string;
};

function getBaseUrl(c: Context): string {
  return new URL(c.req.url).origin;
}

function serveArticle(
  c: Context,
  name: string,
  folder: string,
  opts: SmallblogOptions,
) {
  const {
    siteTitle = "Smallblog",
    locale,
    customHeaderScript,
    customBodyScript,
  } = opts;

  const article = getArticle(name, folder);
  const renderedArticle = article.html;

  if (!renderedArticle) {
    return new Response("Page not found", { status: 404 });
  }

  return c.html(
    `<!DOCTYPE html>` +
    (
      <ArticlePage
        article={article}
        siteTitle={siteTitle}
        url={c.req.url}
        locale={locale}
        bodyScript={customBodyScript}
        headScript={customHeaderScript}
      />
    ),
  );
}

function serveStaticFile(name: string, folder?: string) {
  try {
    let file;
    if (folder) {
      file = Deno.readFileSync(path.join(folder, name));
    } else {
      file = Deno.readFileSync(name);
    }
    return new Response(file, {
      headers: {
        "content-type":
          contentType(name.substring(name.lastIndexOf("."))) ||
          "application/octet-stream",
      },
    });
  } catch (e) {
    console.error("error while loading file:", e);
    return new Response("Not found", { status: 404 });
  }
}

async function getNoArticlesMessage(opts: SmallblogOptions) {
  const { noArticlesMessage, postsFolder, draftsFolder } = opts;

  if (noArticlesMessage) {
    return noArticlesMessage;
  }

  const baseMessage = `<p>You have no articles yet, you can add them by creating a folder <code>${postsFolder}</code> and adding markdown files in it. Don't forget to also add a <code>${draftsFolder}</code> folder for your drafts.</p><p>Read the README for more informations.</p>`;

  const writePermission = await Deno.permissions.query({
    name: "write",
    path: ".",
  });

  if (writePermission.state === "granted") {
    return (
      baseMessage +
      `<p><a class="button" href="/init">Let smallblog do it for you!</a></p>`
    );
  }

  return baseMessage;
}

/**
 * The function to create your blog, you configure your blog with the options
 * and then you just have to write your files
 *
 * @param options The parameters to create the blog.
 * @returns A smallweb/hono app with a fetch method
 */
export function createSmallblog(options: SmallblogOptions): App {
  const {
    postsFolder = "posts/",
    draftsFolder = "drafts/",
    faviconPath = "favicon.ico",
    siteTitle = "Smallblog",
    siteDescription = `The blog: ${siteTitle}`,
    indexTitle,
    indexSubtitle,
    locale,
    customHeaderScript,
    customBodyScript,
  } = options;

  const completeOptions = {
    ...options,
    postsFolder,
    draftsFolder,
    faviconPath,
    siteTitle,
    siteDescription,
  };

  const app = new Hono();

  app.use(compress());

  app.get(
    "*",
    cache({
      cacheName: "smallblog",
      cacheControl: "max-age=3600",
      wait: true,
    }),
  );

  app.get("/", async (c) => {
    const page = c.req.query("page") || 1;
    const search = c.req.query("search") || "";
    const itemsPerPage = 5;
    const posts = getArticles(postsFolder);

    const filteredPosts = filterArticlesFTS(posts, search);

    const hxRequest = c.req.header("hx-request");
    const hxBoosted = c.req.header("hx-boosted");

    if (hxRequest && !hxBoosted) {
      return c.html(
        <Articles
          posts={filteredPosts}
          search={search}
          page={Number(page)}
          itemsPerPage={itemsPerPage}
        />,
        200,
        {
          "HX-Push-Url": search ? "/?page=1&search=" + search : "/?page=1",
        },
      );
    }

    return c.html(
      `<!DOCTYPE html>` +
      (
        <Index
          posts={filteredPosts}
          page={Number(page)}
          itemsPerPage={itemsPerPage}
          search={search}
          siteTitle={siteTitle}
          indexTitle={indexTitle}
          indexSubtitle={indexSubtitle}
          url={c.req.url}
          locale={locale}
          description={siteDescription}
          noArticlesMessage={await getNoArticlesMessage(completeOptions)}
          bodyScript={customBodyScript}
          headScript={customHeaderScript}
        />
      ),
    );
  });

  app.get("/article/:filename{.+$}", (c) => {
    const filename = c.req.param("filename");

    if (!filename) {
      // if the route is /article/
      return new Response("Not found", { status: 404 });
    }
    if (path.extname(filename)) {
      // if the name contains an ext this is not an article
      return serveStaticFile(filename, postsFolder);
    }
    return serveArticle(c, filename, postsFolder, completeOptions);
  });

  app.get("/drafts/:filename{.+$}", (c) => {
    const filename = c.req.param("filename");

    if (!filename) {
      // if the route is /article/
      return new Response("Not found", { status: 404 });
    }
    if (path.extname(filename)) {
      // if the name contains an ext this is not an article
      return serveStaticFile(filename, draftsFolder);
    }
    return serveArticle(c, filename, draftsFolder, completeOptions);
  });

  app.get("/rss.xml", (c) => {
    const baseUrl = getBaseUrl(c);
    const articles = getArticles(postsFolder);
    const xml = getRSS(baseUrl, articles);
    return new Response(xml, {
      headers: {
        "content-type": "application/xml",
      },
    });
  });

  app.get("/sitemap.xml", (c) => {
    const baseUrl = getBaseUrl(c);
    const articles = getArticles(postsFolder);
    const xml = getSitemap(baseUrl, articles);
    console.log(xml);
    if (xml) {
      return new Response(xml, {
        headers: {
          "content-type": "application/xml",
        },
      });
    }
    return new Response("Not found", { status: 404 });
  });

  app.get("/robots.txt", (c) => {
    const baseUrl = getBaseUrl(c);
    const robotTxt = `
      User-agent: *
      Disallow: /drafts
      Sitemap: ${path.join(baseUrl, "/sitemap.xml")}
      `
      .replace(/  +/g, "")
      .trim();
    return new Response(robotTxt, {
      headers: {
        "content-type": "text/plain",
      },
    });
  });

  app.get("/favicon", () => {
    return serveStaticFile(faviconPath);
  });

  app.get("/init", async (c) => {
    console.log("init folder:", postsFolder, draftsFolder);
    fs.ensureDirSync(draftsFolder);
    fs.ensureDirSync(postsFolder);
    if (await isDirectoryEmpty(postsFolder)) {
      storeArticle(postsFolder, "first-article.md", {
        title: "My first article",
      });
      fs.ensureDirSync(path.join(postsFolder, "first-article"));
    }

    return c.redirect("/");
  });

  return {
    ...app,
    run: generateCli(postsFolder, draftsFolder),
  };
}
