# Smallweb Cloud

Smallweb cloud will allow you to register and run your apps under `smallweb.live` domain.

To get started, you'll first need to signup:

```sh
ssh signup@ssh.smallweb.live
```

You'll them be prompted for an email address, and will go through a validation prompt. Your ssh public key will then be associated with your account.

Behind the scenes, a smallweb instance will be created with the following config:

  ```json
  {
    "domain": "<user>.smallweb.live",
    "email": "<email>",
    "dir": "/home/<user>/smallweb",
    "addr": "unix//home/<user>/.cache/smallweb.sock"
  }
  ```
  
You will then be able to use mutagen to sync your smallweb dir (a mutagen agent will be installed on container)

```sh
# install mutagen
brew install mutagen-io/mutagen/mutagen

# connect to a mutagen daemon, running from a container on the smallweb.live VPS
mutagen sync create --name=smallweb --ignore_vcs --ignore=node_modules,DS_Store --mode=two-way-resolved <user>@ssh.smallweb.live:/smallweb ~/smallweb
```

From now on apps will be accessible at:

- `https://<app>.<user>.smallweb.live` for the `fetch` handler (or `https://<app>.<your-domain>` if you setup a custom one).
- `ssh <user>@ssh.smallweb.live [args] ...` for the cli (ex: `ssh <user>@ssh.smallweb.live run <app> [args] ...`)
