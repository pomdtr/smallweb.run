#!/bin/sh

curl -v smtp://smtp.smallweb.run \
  --mail-from 'myself@example.com' \
  --mail-rcpt 'inbox@smallweb.run' \
  --upload-file email.eml
