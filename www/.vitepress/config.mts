import { defineConfig } from 'vitepress'

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
      { text: 'Docs', link: '/docs/getting-started' },
      { text: 'Examples', link: '/examples' },
      { text: 'Blog', link: 'https://blog.smallweb.run' },
    ],
    logo: {
      dark: "/icon-dark.svg",
      light: "/icon-light.svg"
    },
    sidebar: {
      '/docs/': [
        {
          text: 'Introduction',
          items: [
            {
              text: "Getting Started",
              link: "/docs/getting-started"
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
              text: "Secrets",
              link: "/docs/guides/secrets"
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
      ]
    },

    search: {
      provider: "local",
      options: {
        _render: (src, env, md) => {
          if (env.relativePath.startsWith("blog")) {
            return ""
          }

          return md.render(src, env)
        }
      }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/pomdtr/smallweb' },
      { icon: 'discord', link: 'https://discord.gg/BsgQK42qZe' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/smallweb.run' }
    ]
  },
})
