# Syncing files using mutagen

I recommend using [mutagen](https://mutagen.io) to sync your files between your development machine and the server.

Smallweb include a series of commands to help you interact with mutagen, and make the process as seamless as possible.

First, install mutagen on your development machine:

```sh
brew install mutagen-io/mutagen/mutagen
```

Then, run the following command to sync your files:

```bash
# enable the mutagen daemon
mutagen daemon register

# create a sync session
mutagen sync create \
    --name=smallweb \
    --ignore=node_modules,.DS_Store \
    --ignore-vcs \
    --mode=two-way-resolved \
    <remote-smallweb-dir> <local-smallweb-dir>
```

From now on, each time you make a change to your files, they will be automatically synced to the server, and vice-versa.

Your git repository will only be present on one machine, you can choose if you want to keep it on your development machine or on the server (syncing git repositories between machines [is not recommended](https://mutagen.io/documentation/synchronization/version-control-systems)).
