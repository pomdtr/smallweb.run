#!/bin/sh

if [ -z "$1" ]; then
    echo "Usage: $0 <app-name>"
    exit 1
fi

APP_DIR="$SMALLWEB_DIR/$1"
if [ -d "$APP_DIR" ]; then
    echo "App already exists: $APP_DIR"
    exit 1
fi

mkdir -p "$APP_DIR"
cat <<EOF > "$APP_DIR/main.ts"
export default {
    fetch(_req: Request) {
        return new Response("Hello, world!");
    },
    run(_args: string[]) {
        console.log("Hello, world!");
    }
};
EOF

echo "Created app: $APP_DIR" > /dev/stderr
