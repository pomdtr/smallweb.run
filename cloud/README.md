# Smallweb Cloud

> Interested in smallweb cloud? Join the [waitlist](https://cloud.smallweb.run).

## User Experience

Smallweb cloud will allow you to register and run your apps under `smallweb.live` domain.

First, you'll need to signup to at smallweb.live. You'll get a smallweb instance running at `<username>.smallweb.live`, with the ability to edit your apps from your browser.

To edit your apps locally, you'll have to add your ssh public key to your account, then run:

```sh
smallweb sync create <username>@smallweb.live
```

The command will use [mutagen](https://mutagen.io) to sync any changes of your local files to the smallweb instance (and vice-versa).

You'll then be able to access your apps at `https://<app>.<user>.smallweb.live` (or `https://<app>.<your-domain>` if you setup a custom domain).

The cli will work seamlessly, including the `smallweb run` command:

```sh
smallweb run example
```

Another option will be to use the ssh command directly:

```
ssh pomdtr@smallweb.live run example
```
