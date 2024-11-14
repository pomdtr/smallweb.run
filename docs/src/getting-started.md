# Getting started

## Why Smallweb ?

See <https://smallweb.run> for a quick overview of the project.

## Installation

Smallweb installations steps heavily depends on the experience you want to have with Smallweb. Here are a few options:

- [Localhost Setup](./hosting/localhost/localhost.md) - Easiest way to get started, no need for a dedicated server or a domain name. Work on MacOS and Linux.
- [Home Server Setup](./hosting/cloudflare/cloudflare.md) - Host you apps on your home server, and expose them to the internet using Cloudflare Tunnel. Requires a domain name.
- [VPS Setup](./hosting/vps.md) - Similar to the Home Server setup, but using a VPS Provider instead. Shows you how to setup a fresh Debian 12 VPS to host your smallweb apps.

## Syncing files between systems

Smallweb is built to play well with file-syncing tools like [mutagen](https://mutagen.io), allowing you to develop your apps on your local machine, and have them instantly served under your domain.

Refer to [Syncing files using mutagen](./guides/file-sync.md) for more information.

## Usage

Follow the [Routing](./guides/routing.md) guide to learn more about the smallweb folder structure, and create your first app.
