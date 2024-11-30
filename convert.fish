set -l APPS .smallweb
for APP in $APPS
    sops -d --output-type dotenv $APP/secrets.enc.json \
        | sops -e --input-type dotenv --output-type=dotenv /dev/stdin >$APP/secrets.enc.env \
        && rm $APP/secrets.enc.json
end
