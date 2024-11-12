# smallweb.run

This repository is a monorepo of all my apps running under the smallweb.run domain.

I use the following smallweb plugin to commit changes to github (stored at `~/.local/bin/smallweb-bump`):

```sh
#!/bin/sh

cd "$SMALLWEB_DIR" || exit 1
git add .
git commit -m "$(date +'%e %b %Y, %H:%M')"
git push
```

I edit these files locally, and use [mutagen](https://mutagen.io) to sync them to my VPS.

```sh
mutagen sync create \
  --name=smallweb \
  --ignore-vcs \
  --ignore=node_modules \
  --mode=two-way-resolved \
  smallweb.run:/home/smallweb.run/smallweb ~/smallweb
```

If you have your own instance of smallweb, you can copy any folder from this repository to your own server, and it should work out of the box. Some apps require a `.env` file to be created in the root of the app folder, with the required environment variables.
