# smallweb.run

This repository is a monorepo of all my apps running under the smallweb.run domain.

I use the [bump plugin](../.smallweb/plugins/bump.sh) to commit and push changes to this repository.

These files are edited locally, and I use [mutagen](https://mutagen.io) to sync them to my VPS.

```sh
mutagen sync create \
  --name=smallweb \
  --ignore-vcs \
  --ignore=node_modules \
  --mode=two-way-resolved \
  smallweb.run:/home/smallweb.run/smallweb ~/smallweb
```

If you have your own instance of smallweb, you can copy any folder from this repository to your own server, and it should work out of the box. Some apps require a `.env` file to be created in the root of the app folder, with the required environment variables.
