#!/bin/sh

if [ ! -f secrets.enc.json ]; then
    exec sops "$SMALLWEB_DIR/.smallweb/secrets.enc.json"
fi

exec sops secrets.enc.json
