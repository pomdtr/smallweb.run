import { defineConfig, createContentLoader } from 'vitepress'
import { Feed } from 'feed'
import path from 'node:path';
import { writeFileSync } from 'node:fs';

const title = "Smallweb"
const description = "Your internet folder"


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title,
  description: description,
  cleanUrls: true,
  head: [
    ["link", { rel: "icon", href: "https://fav.farm/📁" }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Docs', link: '/docs' },
      { text: 'Blog', link: '/blog' },
      { text: 'Examples', link: '/examples' },
    ],
    logo: {
      dark: "/icon-dark.svg",
      light: "/icon-light.svg"
    },
    sidebar: [
      {
        text: 'Introduction',
        items: [
          {
            text: "Getting Started",
            link: "/docs"
          }
        ]
      },
      {
        text: "Guides",
        items: [
          {
            text: "Routing",
            link: "/docs/guides/routing"
          },
          {
            text: "HTTP Requests",
            link: "/docs/guides/http"
          },
          {
            text: "Cli Commands",
            link: "/docs/guides/commands"
          },
          {
            text: "Cron Jobs",
            link: "/docs/guides/cron"
          },
          {
            text: "Environment Variables",
            link: "/docs/guides/env"
          },
          {
            text: "Plugins",
            link: "/docs/guides/plugins"
          },
          {
            text: "Authentication",
            link: "/docs/guides/auth"
          },
          {
            text: "App Sandbox",
            link: "/docs/guides/sandbox"
          },
          {
            text: "File Sync",
            link: "/docs/guides/file-sync"
          },
        ]
      },
      {
        "text": "Hosting",
        items: [
          {
            text: "Local Setup",
            link: "/docs/hosting/local",
            items: [
              { text: "MacOS", link: "/docs/hosting/local/macos", },
              { text: "Linux", link: "/docs/hosting/local/linux", },
              { text: "Windows", link: "/docs/hosting/local/windows", }
            ]
          },
          { text: "Cloudflare Tunnel", link: "/docs/hosting/cloudflare" },
          { text: "VPS", link: "/docs/hosting/vps" },
          { text: "Deno Deploy", link: "/docs/hosting/deno-deploy" },
          { text: "Smallweb Cloud", link: "/docs/hosting/smallweb-cloud" },
        ]
      },
      {
        text: "References",
        items: [
          { text: "Global Config", link: "/docs/reference/global-config" },
          { text: "App Config", link: "/docs/reference/app-config" },
          { text: "CLI", link: "/docs/reference/cli" },
        ]
      }
    ],

    search: {
      provider: "local"
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/pomdtr/smallweb' },
      { icon: 'discord', link: 'https://discord.gg/BsgQK42qZe' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/smallweb.run' }
    ]
  },
  async buildEnd(config) {
    const feed = new Feed({
      id: "smallweb.run",
      title,
      copyright: "",
    })
    const contentLoader = createContentLoader("blog/*.md", {
      render: true,
    })
    const posts = await (await contentLoader.load()).sort((a, b) => {
      return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    })

    for (const post of posts) {
      feed.addItem({
        title: post.frontmatter.title,
        link: `https://smallweb.run${post.url}`,
        date: new Date(post.frontmatter.date),
        author: post.frontmatter.author ? [{ name: post.frontmatter.author }] : [],
        category: post.frontmatter.tags ? post.frontmatter.tags.map((tag: string) => ({ name: tag })) : [],
        content: post.html,
      })
    }

    writeFileSync(path.join(config.outDir, 'feed.rss'), feed.rss2());
  }
})
