# Smallweb Cloud

> Interested in smallweb cloud? Join the [waitlist](https://cloud.smallweb.run).

## User Experience

Smallweb cloud will allow you to register and run your apps under `smallweb.live` domain.

Here is how to get started:

```sh
# install smallweb, mutagen and deno
curl -sSfL https://install.smallweb.run | sh
# init smallweb folders
smallweb init
# synchronize your smallweb folder with smallweb.live
smallweb sync create <username>@smallweb.live
```

Your public key will be checked against `https://github.com/<username>.keys`. You'll be able to access your logs at https://smallweb.live/logs, after authenticating using github oauth.

The command will use [mutagen](https://mutagen.io) to sync any changes of your local files to the smallweb instance (and vice-versa).

You'll then be able to access your apps at `https://<app>.<user>.smallweb.live` (or `https://<app>.<your-domain>` if you setup a custom domain).

The cli will work seamlessly, including the `smallweb run` command:

```sh
smallweb run example
```
