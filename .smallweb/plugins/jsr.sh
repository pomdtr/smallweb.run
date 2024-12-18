#!/bin/sh

if ! [ -f "deno.json" ]; then
    echo "no deno.json file found"
    exit 1
fi

NAME=$(jq -r '.name' deno.json)

open "https://jsr.io/$NAME"

