import * as path from "@std/path";

function generateArticle(
  title: string = "My first article",
  content: string = "This is my first article",
  published: boolean = true,
  tags: string[] = ["markdown", "test"],
  authors: string[] = ["Default author"],
  date: string = new Date().toISOString().split("T")[0],
  section: string = "tech",
): string {
  return `---
    title: ${title}
    description: A post to test a small content
    authors:
        - ${authors.join("\n    - ")}
    tags:
        - ${tags.join("\n    - ")}
    published: ${published}
    date: ${date}
    section: ${section}
    ---

    ${content}
    `
    .replace(/  +/g, "")
    .trim();
}

export function storeArticle(
  folder: string,
  filename: string = "first-article.md",
  params: {
    title?: string;
    content?: string;
    published?: boolean;
    tags?: string[];
    authors?: string[];
    date?: string;
    section?: string;
  } = {
    title: "My first article",
    content: "This is my first article",
    published: true,
    tags: ["markdown", "test"],
    authors: ["Default author"],
    date: new Date().toISOString().split("T")[0],
    section: "tech",
  },
) {
  const article = generateArticle(
    params.title,
    params.content,
    params.published,
    params.tags,
    params.authors,
    params.date,
    params.section,
  );
  Deno.writeTextFile(path.join(folder, filename), article);
}
