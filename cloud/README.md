# smallweb.live

> Interested in smallweb.live? Join the [waitlist](https://cloud.smallweb.run).
>
> Want to learn more about smallweb ? See the [homepage](https://smallweb.run).

Your apps under `smallweb.live` domain (or your own custom domain). No need to buy a VPS / domain, or install anything on your device.

I want to delegate identity to github.  When you run:

```
smallweb sync <user>@ssh.smallweb.live
```

smallweb.live will check that your public key against `https://github.com/<user>.keys`. If the check is successful, your smallweb dir will be synced with smallweb.live.

Each time you create a new app, it will instantly be available at `https://<app>.<user>.smallweb.live` (ex: `https://smallblog.pomdtr.smallweb.live`). Of course, you'll be able to associate your own domain, and access your apps at `https://<app>.<domain>`.

Going to `https://<user>.smallweb.live` will redirect you to `https://www.<user>.smallweb.live` (if the `www` app exists).

Since the smallweb folder is synced locally, the smallweb cli will just work!

Of course, you'll have the ability to sync your folder locally using mutagen, and use the `smallweb` cli to manager your websites.
