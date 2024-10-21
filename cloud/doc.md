# Smallweb Cloud

Smallweb cloud will allow you to register and run your apps under `smallweb.live` domain.

To get started, you'll first need to signup:

```sh
ssh signup@smallweb.live
```

You'll need to pride a valid email address. Your public key will then be associated with your account.

You will then be able to use mutagen to sync your smallweb dir:

```sh
mutagen sync create --name=smallweb <user>@smallweb.live:/home/<user>/smallweb ~/smallweb --ignore_vcs --ignore=node_modules
```

Behind the scenes:

- A user will be created on the smallweb.live VPS with the following config

  ```json
  {
    "addr": "unix//home/<user>/smallweb.sock",
    "domain": "<user>.smallweb.live",
    "email": "<email>",
    "dir": "/home/<user>/smallweb"
  }
  ```

- The smallweb dir will be initialized with some apps
- The smallweb process will be started

From now on apps will be accessible at:

- `https://<app>.<user>.smallweb.live` for the `fetch` handler (or `https://<app>.<your-domain>` if you setup a custom one).
- `ssh <user>@smallweb.live run <app>` for the `run` handler

Private apps will be protected behind github oauth.

You'll also be able to use some commands from the cli using:

```sh
ssh <user>@smallweb.live [command]
```

Ex:

```sh
ssh <user>@smallweb.live log http --host example.<user>.smallweb.live
```
