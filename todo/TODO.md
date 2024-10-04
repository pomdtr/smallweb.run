# Smallweb TODO

This website list what's next for [smallweb](https://smallweb.run).

## `smallweb up --tunnel` flag

I want to allow users to try out the full smallweb experience without having to buy a domain, and setup dns records.

A new user would just run:

- `smallweb up --tunnel` to get a random tunnel name
- `smallweb up --tunnel=<tunnel>` to choose a tunnel name

Then, his apps would be instantly available at `https://<app>-<tunnel>.smallweb.live`.

I found multiple projects that would allow me to setup something like this:

- https://github.com/openziti/zrok?tab=readme-ov-file#the-zrok-sdk
- https://github.com/koding/tunnel

## `@smallweb/storage` package

Build a generic storage package inspired by [unstorage](https://unstorage.unjs.io/).

## Allow the cli to manipulate a remote smallweb instance

You should be able to interact with a remote smallweb instance as if it was a local one (with completions, ability to open an url in browser, ...)

In order to achieve this, the management command from the cli should always interact with the REST API, either:

- through an unix socket if the cli and the evaluation server are on the same machine
- using http request if the cli and evaluation servers are on different machines

The only exception will be the `smallweb run`, that should probably use ssh.

## Telegram Bot

## Raycast Extension

## VS Code Extension

## Analytics

ex: store no of views per day/week/month/year/all time

## Website Redesign

The website was built in a rush. I'm planning to use [starlight](https://starlight.astro.build/) for the homepage, docs and blog.

## Record youtube videos for smallweb

I need to show the world the capabilities of smallweb, and the way I'm using it. I'll start a youtube channel to do so.

## Smallweb Cloud

Smallweb cloud will allow you to register your own namespace on the `smallweb.run` domain.

First, you'll need to go to `signup.smallweb.run`, and input your email address.

You'll then be able to edit your smallweb config from the browser, and associate your public key with your account.

Your apps will be accessible at:

- `https://<app>.<user>.smallweb.run` for the `fetch` handler
- `ssh <app>.<user>@smallweb.run [args]` for the `run` handler

Of course, you'll be able to register your own domain instead, changing the endpoint to:

- `https://<app>.<domain>` for the `fetch` handler
- `ssh <app>@<domain> [args]` for the `run` handler

You'll then be able to sync your smallweb folder with a local folder using [mutagen](https://mutagen.io/):

```sh
mutagen sync create --name smallweb <user>@smallweb.run:/home/<user>/smallweb ~/smallweb
```

## Token Scope (done)

Currently, auth tokens have access to everything. You should be able to limit the scope of a token.

```sh
# has access to everything, including `cli.<domain>` to run cli commands.
smallweb token create --admin
# only has access to the `tldraw.<domain>` and `bookmarks.<domain>` apps.
smallweb token create --app tldraw --app bookmarks
```

## REST API (done)

Each smallweb instance should come with a REST API, that you can serve on any domain using:

```json
{
    "private": true,
    "entrypoint": "smallweb:api",
    "publicRoutes": [
        "/openapi.json"
    ]
}
```

The api will include an OpenAPI spec, allowing me to automatically generates a typed deno client for it, distributed on JSR.

The api should also be available to the smallweb CLI using a unix socket.

## Improved logs (done)

Currently, logs are awful. In the future, they will be accessible as a stream at https://<api-domain>/v0/logs (allowing you to access them from any client).

You'll also be able to access them using the CLI:

```sh
smallweb logs --app <app> --type [http|cron|console]
```
