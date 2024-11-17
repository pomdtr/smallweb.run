#!/bin/sh

cd "$SMALLWEB_DIR" || exit 1

git add .
git commit -m "$(date +'%e %b %Y, %H:%M')"
git push
