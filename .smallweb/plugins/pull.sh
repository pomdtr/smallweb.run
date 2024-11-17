#!/bin/sh

cd "$SMALLWEB_DIR" || exit 1

git pull --ff-only
git submodule update --remote --merge
