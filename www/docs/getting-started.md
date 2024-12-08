# Getting started

## Why Smallweb ?

Smallweb is a new take on self-hosting. The goal is to make it as easy as possible to host your own apps. To achieve this, it uses a "file-based hosting" approach: every subfolder in your smallweb folder becomes a unique domain.

Smallweb is obsessed with scaling down. No dev server or a build is required, and you don't even need to care about deployment. You can just write a single file, hit save, and voila! Your app is live.

## Live Demo

A shared public instance of smallweb is available at [smallweb.live](https://smallweb.live). You can use it to test smallweb without setting up your own instance.

Please ping me either on [bluesky](https://bsky.app/profile/pomdtr.me) or [discord](https://discord.gg/BsgQK42qZe) if the demo is down.

## Community

Join the [discord server](https://discord.gg/BsgQK42qZe) to ask questions, share your projects, and get help.

## Installation

```sh
# use the install script
curl -fsSL https://install.smallweb.run | sh

# or use homebrew
brew install pomdtr/tap/smallweb
```

Smallweb installations steps heavily depends on the experience you want to have with Smallweb. Here are a few options:

- [Local Setup](./hosting/local/index.md) - Easiest way to get started, no need for a dedicated server or a domain name. Work on MacOS and Linux.
- [VPS Setup](./hosting/vps.md) - Learn how to deploy smallweb on a VPS. Shows you how to setup a fresh Debian VPS to host your smallweb apps.
