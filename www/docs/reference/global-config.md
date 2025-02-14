# Global Config

The smallweb config is located at `$SMALLWEB_DIR/.smallweb/config.json`.

If `SMALLWEB_DIR` is not set, it defaults to `~/smallweb`.

Only the `domain` field is required. The rest are optional.

If you sync the smallweb dir between multiple servers, but want to set different config value depending on the server, you can use env variables to set config value.

```sh
# run smallweb with a different domain that the one set in the config
SMALLWEB_DOMAIN=localhost smallweb up
```

## Available Fields

### `domain`

The `domain` field defines the apex domain used for routing. By default, it is `localhost`.

```json
{
  "domain": "example.com"
}
```

See the [Routing](../guides/routing.md) guide for more information.

### `customDomains`

The `customDomains` field is an object that maps custom domains to apps.

```json
{
  "customDomains": {
    "example.com": "example",
  }
}
```

## Admin Apps

The list of admin apps. More info about admin apps can be found in the [Admin Apps](../guides/permissions.md#admin-apps) guide.

```json
{
  "adminApps": [
    "vscode"
  ]
}
```
