#!/bin/sh

if [ -f secrets.env ]; then
  exec sops secrets.env
fi

exec sops "$SMALLWEB_DIR/secrets.env"
