#!/bin/sh

if [ ! -f secrets.enc.json ]; then
    exec sops "$SMALLWEB_DIR/.smallweb/secrets.enc.env"
fi

exec sops secrets.enc.env
