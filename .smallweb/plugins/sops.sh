#!/bin/bash

pushd "$SMALLWEB_DIR" > /dev/null || exit

exec sops "$@"