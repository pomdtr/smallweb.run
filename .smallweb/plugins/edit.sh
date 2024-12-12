#!/bin/sh

if [ -z "$1" ]; then
    exec code "$SMALLWEB_DIR"
fi

exec code "$SMALLWEB_DIR/$1"
