# Syncing files using mutagen

I recommend using [mutagen](https://mutagen.io) to sync your files between your development machine and the server.

First, install mutagen on your development machine, then enable the daemon using `mutagen daemon register`, and finally, run the following command to sync your files:

```bash
mutagen sync create --name=smallweb --ignore-vcs --ignore=node_modules --mode=two-way-resolved smallweb@<server-ip>:/home/smallweb/smallweb ~/smallweb
```

From now on, each time you make a change to your files, they will be automatically synced to the server, and vice versa.

Your git repository will only be present on one machine, you can choose if you want to keep it on your development machine or on the server (syncing git repositories [is not recommended](https://mutagen.io/documentation/synchronization/version-control-systems)).
