# Smallweb TODO

This website list what's next for [smallweb](https://smallweb.run). 

You can view the source at <https://github.smallweb.run/todo/main.ts>.

## Smallweb Cloud

Smallweb cloud will allow you to register your own namespace on the `smallweb.live` domain. It'll will use github for oauth and usernames.

Your apps will be accessible at:

- `https://<app>.<username>.smallweb.live` for the `fetch` handler
- `ssh <user>@smallweb.live <app>` for the `run` handler (authenticated using the `https://github.com/<username>.keys` endpoint)

Of course, you'll be able to register your own domain instead, changing the endpoint to:

- `https://<app>.<domain>` for the `fetch` handler
- the run endpoint will stay the same (or optionally `<user>@<domain>`)

When you'll go to the apex domain (`https://smallweb.live`), you'll be greated by a VS Code instance, allowing you to edit your websites.

## Ideas

- ability to inject scripts in every app (ex: dot shortcut)
- add cache dir for lazy builds

## Additional file servers

- [S3 Server](https://github.com/johannesboyne/gofakes3)
- [SFTP Server](https://github.com/pkg/sftp)

## Adaptor for [blot.im](https://blot.im) websites

## Built-in lastlogin

Maybe only supporting github at first ?

## Built-in localhost.run

## Add a cache dir for lazy builds

## Automatic backups to github / git repository

## Manipulate a remote smallweb instance from the cli

You should be able to interact with a remote smallweb instance as if it was a local one (with completions, unable to open an url in browser, ...)

In order to achieve this, the management command from the cli should always interact with the REST API, either:

- through an unix socket if the cli and the evaluation server are on the same machine
- using http request if the cli and evaluation servers are on different machines

The only exception will be the `smallweb run`, that should probably use ssh.

## Integrations

### Telegram Bot

- Distributed as a smallweb app

### Raycast Extension

https://github.com/pomdtr/smallweb-raycast


### VS Code Extension

## Website Redesign

The website was built in a rush. I'm planning to use [starlight](https://starlight.astro.build/) for the homepage, docs and blog.

## Record youtube videos for smallweb

I need to show the world the capabilities of smallweb, and the way I'm using it. I'll start a youtube channel to do so. 

## `smallweb tunnel` command (done)

```console
$ smallweb tunnel <app>
Your app is now accessible at https://<app>-<tunnel-id>.smallweb.live
```

Behind the scenes, it creates a ssh tunnel using:

```sh
ssh -R 80:localhost:<freeport> -p 2222 localhost.run
```

You'll have the ability to use your own proxy server with the `smallweb proxy` command.

You can set a custom one using:

```json
{
    "proxy": "<proxy-address>"
}
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

Currently, logs are awful. In the future, they will be accessible as a stream at` https://<api-domain>/v0/logs` (allowing you to access them from any client).

You'll also be able to access them using the CLI:

```sh
smallweb logs --app <app> --type [http|cron|console]
```
