import { defineConfig } from "vitepress";
import llmstxt from 'vitepress-plugin-llms'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Smallweb",
  vite: {
    plugins: [llmstxt()],
  },
  description:
    "A self-hostable personal cloud inspired by serverless platforms and cgi-bin.",
  outDir: "dist",
  cleanUrls: true,
  sitemap: {
    hostname: "https://smallweb.run",
  },
  head: [
    [
      "meta",
      {
        property: "og:image",
        content: "/banner-icon.png",
      },
    ],
    ["meta", { name: "og:type", content: "website" }],
    ["meta", { name: "twitter:domain", content: "smallweb.run" }],
    [
      "meta",
      {
        property: "twitter:image",
        content: "/banner-icon.png",
      },
    ],
    [
      "meta",
      { property: "twitter:card", content: "summary_large_image" },
    ],
    ["link", {
      rel: "icon",
      type: "image/png",
      href: "/favicon-96x96.png",
      sizes: "96x96",
    }],
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    ["link", { rel: "shortcut icon", href: "/favicon.ico" }],
    ["link", {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    }],
    ["meta", { name: "apple-mobile-web-app-title", content: "Smallweb" }],
    ["link", { rel: "me", href: "mailto:achille.lacoin@gmail.com" }],
    ["link", { rel: "webmention", href: "https://webmention.io/smallweb.run/webmention" }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Docs", link: "/docs/getting-started" },
      { text: "Apps", link: "https://github.com/topics/smallweb-app" },
      { text: "Blog", link: "https://blog.smallweb.run" },
      { text: "Sponsor", link: "https://github.com/sponsors/pomdtr" },
    ],
    logo: {
      dark: "/icon-dark.svg",
      light: "/icon-light.svg",
    },
    siteTitle: "Smallweb",
    editLink: {
      pattern: "https://github.com/pomdtr/smallweb.run/tree/main/www/:path",
    },
    sidebar: {
      "/docs/": [
        {
          text: "Introduction",
          items: [
            {
              text: "Getting Started",
              link: "/docs/getting-started",
            },
          ],
        },
        {
          text: "Concepts",
          items: [
            {
              text: "HTTP Requests",
              link: "/docs/guides/http",
            },
            {
              text: "CLI Commands",
              link: "/docs/guides/commands",
            },
            {
              text: "SSH Server",
              link: "/docs/guides/ssh",
            },
            {
              text: "Email Messages",
              link: "/docs/guides/email",
            },
            {
              text: "Git Integration",
              link: "/docs/guides/git",
            },
            {
              text: "Cron Jobs",
              link: "/docs/guides/cron",
            },
            {
              text: "Environment Variables",
              link: "/docs/guides/env",
            },
            {
              text: "Data Storage",
              link: "/docs/guides/data",
            },
            {
              text: "Opentelemetry",
              link: "/docs/guides/opentelemetry",
            },
            {
              text: "Plugins",
              link: "/docs/guides/plugins",
            },
            {
              text: "Authentication",
              link: "/docs/guides/authentication",
            },
            {
              text: "Permissions",
              link: "/docs/guides/permissions",
            },
            {
              text: "Symlinks",
              link: "/docs/guides/symlinks",
            },
            {
              text: "File Sync",
              link: "/docs/guides/file-sync",
            },
            {
              text: "Integrations",
              link: "/docs/guides/integrations",
            }
          ],
        },
        {
          "text": "Hosting",
          items: [
            { text: "VPS", link: "/docs/hosting/vps" },
            {
              text: "Local Setup",
              link: "/docs/hosting/local",
              items: [
                { text: "MacOS", link: "/docs/hosting/local/macos" },
                { text: "Linux", link: "/docs/hosting/local/linux" },
                { text: "Windows", link: "/docs/hosting/local/windows" },
              ],
            },
            { text: "Cloudflare Tunnel", link: "/docs/hosting/cloudflare" },
            { text: "Runtipi", link: "/docs/hosting/runtipi" },
            { text: "Smallweb Cloud", link: "/docs/hosting/smallweb-cloud" },
          ],
        },
        {
          text: "References",
          items: [
            { text: "Config", link: "/docs/reference/config" },
            { text: "App Manifest", link: "/docs/reference/manifest" },
            { text: "Editor Support", link: "/docs/reference/editor" },
            { text: "CLI", link: "/docs/reference/cli" },
          ],
        },
      ],
    },

    search: {
      provider: "local",
      options: {
        _render: (src, env, md) => {
          if (env.relativePath.startsWith("blog")) {
            return "";
          }

          return md.render(src, env);
        },
      },
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/pomdtr/smallweb" },
      { icon: "discord", link: "https://discord.gg/BsgQK42qZe" },
      { icon: "bluesky", link: "https://bsky.app/profile/smallweb.run" },
    ],
  },
});
