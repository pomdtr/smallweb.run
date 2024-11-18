# Smallweb Plugins

The smallweb CLI can be extended with plugins. To create a new plugin, just create a script in `$SMALLWEB_DIR/.smallweb/plugins`. The script name (without the extension) will be mapped to a cli subcommand.

Ex: if i create the following file as `$SMALLWEB_DIR/.smallweb/plugins/edit.sh`:

```sh
#!/bin/sh

if [ -z "$1" ]; then
    echo "Usage: smallweb edit <app>"
    exit 1
fi

code "$SMALLWEB_DIR/$1"
```

I will be able to run `smallweb edit my-app` to open the `my-app` folder in VSCode.

## Environment variables available to plugins

- `SMALLWEB_VERSION`: The version of the smallweb CLI.
- `SMALLWEB_DIR`: The directory where the smallweb apps are stored.
- `SMALLWEB_DOMAIN`: The domain where the smallweb apps are served from.
