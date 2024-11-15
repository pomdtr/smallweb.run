#!/bin/sh

if [ -z "$1" ]; then
    echo "Usage: smallweb edit <app>"
    exit 1
fi

code "$SMALLWEB_DIR/$1"
