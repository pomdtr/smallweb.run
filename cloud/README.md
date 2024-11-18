# Smallweb Cloud

> Interested in smallweb cloud? Join the [waitlist](https://cloud.smallweb.run).

## User Experience

Smallweb cloud will allow you to register and run your apps under `smallweb.live` domain.

First, you'll need to signup to smallweb.live. Once you're done, you'll have the ability to spawn a new smallweb machine.

To edit your apps locally, you'll just have to generate an access token, and then use the following command:

```sh
smallweb sync create <token>@<user>.smallweb.live
```

The command will use [mutagen](https://mutagen.io) to sync any changes of your local files to the smallweb machine (and vice-versa).

You'll then be able to access your apps at `https://<app>.<user>.smallweb.live` (or `https://<app>.<your-domain>` if you setup a custom domain).

The cli will work seamlessly, including the `smallweb run` command:

```sh
smallweb run example
```
