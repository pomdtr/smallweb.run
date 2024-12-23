# Syncing files using mutagen

I recommend using [mutagen](https://mutagen.io) to sync your files between your development machine and the server.

Smallweb includes a series of commands to help you interact with mutagen, and make the process as seamless as possible.

## Installation

First, install the required tools on your development machine using Homebrew:

```sh
brew install deno
brew install pomdtr/tap/smallweb
brew install mutagen-io/mutagen/mutagen
```

## Setting up mutagen

Enable the mutagen daemon:

```sh
# Start the mutagen daemon
mutagen daemon start

# Optional: Configure mutagen to start on boot
mutagen daemon register
```

## Configuring sync

The sync command follows this format:

```sh
smallweb --dir ~/smallweb sync <remote-server> /home/<user>/smallweb
```

Where:
- `~/smallweb` is your local directory
- `<remote-server>` is your SSH connection string (e.g., `user@hostname`)
- `/home/<user>/smallweb` is the path to smallweb on your server

For example, if you connect to your server using `ssh debian@example.com`, your sync command would be:

```sh
smallweb --dir ~/smallweb sync debian@example.com /home/debian/smallweb
```

From now on, each time you make a change to your files, they will be automatically synced between your local machine and the server.

## Important note about git

Your git repository will only be present on one machine. You can choose if you want to keep it on your development machine or on the server (syncing git repositories between machines [is not recommended](https://mutagen.io/documentation/synchronization/version-control-systems)).
