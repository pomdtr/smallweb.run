#!/bin/sh

if [ -z "$1" ]; then
    exec code "$SMALLWEB_DIR"
fi

if [ "$1" = "--config" ]; then
    exec code "$SMALLWEB_DIR/.smallweb/config.json"
fi

APP_DIR="$SMALLWEB_DIR/$1"
if [ ! -d "$APP_DIR" ]; then
    echo "The app '$1' does not exist." > /dev/stderr
    exit 1
fi

exec code "$APP_DIR"
