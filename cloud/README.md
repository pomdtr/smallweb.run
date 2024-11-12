# Smallweb Cloud

> Interested in smallweb cloud? Join the [waitlist](https://cloud.smallweb.run).

Smallweb cloud will allow you to register and run your apps under `smallweb.live` domain.

First, you'll need to create an account, either by going to `https://signup.smallweb.live` or using `ssh signup@smallweb.live`.

You'll get a command allowing to sync your smallweb dir locally using [mutagen](https://mutagen.io).

The syncing process will keep running in the background, so any changes to your local files will be instantly mirrored to your server (and vice-versa).

You'll then be able to access your apps at `https://<app>.<user>.smallweb.live` (or `https://<app>.<your-domain>` if you setup a custom domain).

And you'll be able to control your apps using the regular smallweb commands:

```console
$ smallweb ls
Name        Dir                    Url
api         ~/smallweb/api         https://api.<user>.smallweb.live/
assets      ~/smallweb/assets      https://assets.<user>.smallweb.live/
astro       ~/smallweb/astro       https://astro.<user>.smallweb.live/
```

And run your cli entrypoints using `smallweb run` (if you have a deno installed):

```
$ smallweb run vt --help
```

## Architecture

![architecture diagram](https://assets.smallweb.run/architecture.excalidraw.png)
