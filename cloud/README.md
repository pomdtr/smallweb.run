# Smallweb Cloud

> Interested in smallweb cloud? Join the [waitlist](https://cloud.smallweb.run). 
>
> Want to learn more about smallweb ? See the [homepage](https://smallweb.run).

Smallweb cloud will run your apps under `smallweb.live` domain (or your own custom domain). No need to buy a VPS / domain, or install anything on your device.

When you go to `smallweb.live`, you'll have the ability to signup using github. After login in, you'll be greated with your smallweb folder, opened in a web version of vscode.

![](https://assets.smallweb.run/vscode-cloud.png)

Each time you create a new app, it will instantly be available at `https://<app>.<user>.smallweb.live` (ex: `https://smallblog.pomdtr.smallweb.live`). Going to `https://<user>.smallweb.live` will redirect you to `https://www.<user>.smallweb.live` (if the `www` app exists).

You'll be able to access the `smallweb` cli using `ssh <user>@smallweb.live` (ex: `ssh pomdtr@smallweb.live run smallblog --help`). For it to work, you'll need to add your public ssh key to github (as smallweb cloud will use `https://github.com/<user>.keys` to check your key).

Of course, you'll have the ability to sync your folder locally using mutagen, and use the `smallweb` cli to manager your websites.

<!-- Here is how to get started:

```sh
# install smallweb, mutagen and deno
curl -sSfL https://install.smallweb.run | sh
# init smallweb folders
smallweb init
# synchronize your smallweb folder with smallweb.live
smallweb sync create <username>@smallweb.live
```

Your public key will be checked against `https://github.com/<username>.keys`.

You'll then be able to access your apps at `https://<app>.<user>.smallweb.live` (or `https://<app>.<your-domain>` if you setup a custom domain).

The cli will work seamlessly, including the `smallweb run` command:

```sh
smallweb run example
```

You'll be able to access your logs at `https://smallweb.live/logs`, after authenticating using github oauth. -->
