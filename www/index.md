---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
head:
  - [
      'meta',
      {
        property: 'og:description',
        content: 'A self-hostable personal cloud inspired by serverless platforms and cgi-bin.',
      }
    ]
hero:
  name: "Smallweb"
  text: "Your internet folder"
  tagline: A self-hostable personal cloud inspired by serverless platforms and cgi-bin.
  image:
    light: /icon-light.svg
    dark: /icon-dark.svg
    alt: Smallweb
  actions:
    - theme: brand
      text: Get Started
      link: /docs/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/pomdtr/smallweb

features:
  - icon: 📂
    title: File-Based Hosting
    details: Smallweb maps subdomains to subfolders in your smallweb directory. Creating a new app is as simple as creating a new folder.
  - icon: ⚡
    title: Instant Feedback
    details: No build or deploy step is required. Just save your changes and refresh your browser.
  - icon: 🔐
    title: Secure by Default
    details: Each smallweb app is sandboxed using Deno. By default, it only has access to its own folder.
  - icon: 🚀
    title: Deploy anywhere
    details: The whole smallweb codebase is compiled to a single binary. You can run it on your local machine, a VPS, or a cloud provider.
---

