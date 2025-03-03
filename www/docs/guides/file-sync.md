# Syncing files using mutagen

I recommend using [mutagen](https://mutagen.io) to sync your files between your development machine and the server.

## Installation

First, install the required tools on your development machine using Homebrew:

```sh
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

# Start the syncing process

To start syncing your files, run the following command:

```sh
mutagen sync create \
    --ignore=node_modules,.DS_Store,.smallweb/repos \
    --ignore-vcs \
    --mode=two-way-resolved \
    <remote>:<remote-dir> <local-dir>
```

For example, if you connect to your server using `ssh debian@example.com`, your sync command would be:

```sh
mutagen sync create \
    --ignore=node_modules,.DS_Store,.smallweb/repos \
    --ignore-vcs \
    --mode=two-way-resolved \
    debian@example.com:/home/debian/smallweb ~/smallweb
```

From now on, each time you make a change to your files, they will be automatically synced to the server, and vice-versa.

Your git repository will only be present on one machine. You can choose if you want to keep it on your development machine or on the server (syncing git repositories between machines [is not recommended](https://mutagen.io/documentation/synchronization/version-control-systems)).

## Diagnosing sync issues

If you encounter any issues with the sync, you can check the errors using the following command:

```sh
mutagen sync list --long
```
