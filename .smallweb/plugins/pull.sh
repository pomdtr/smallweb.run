#!/bin/sh

cd "$SMALLWEB_DIR" || exit 1

git submodule foreach git pull origin main
