import { stringify } from "@libs/xml";

export type Changefreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface URLData {
  loc: string;
  lastmod?: string;
  changefreq?: Changefreq;
  priority?: number;
}

export interface Options {
  lastmod?: string;
  changefreq?: Changefreq;
  priority?: number;
}

export class Sitemap {
  datas: Array<URLData>;
  baseURL?: string | URL;

  constructor(baseURL?: string | URL) {
    this.datas = [];
    this.baseURL = baseURL;
  }

  add(url: string | URL, options?: Options): void {
    options = options ? options : {};
    try {
      url = new URL(url, this.baseURL).toString();
    } catch (e) {
      if (e instanceof TypeError) {
        throw new TypeError("Invalid URL.");
      } else {
        throw e;
      }
    }
    if (url.length > 2048) {
      throw new TypeError(
        "URL must be less than 2048 characters according to sitemap specification.",
      );
    }
    const data: URLData = {
      loc: url,
    };
    if ("lastmod" in options) data.lastmod = options.lastmod;
    if ("changefreq" in options) data.changefreq = options.changefreq;
    if ("priority" in options) data.priority = options.priority;
    this.datas.push(data);
  }

  get sitemap(): string {
    return this.toXML(this.datas);
  }

  toXML(data: URLData[]) {
    return (
      '<?xml version="1.0" encoding="UTF-8"?>' +
      stringify(
        {
          urlset: {
            "@xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
            url: data,
          },
        },
      )
        .replaceAll("\n", "")
    );
  }
}
