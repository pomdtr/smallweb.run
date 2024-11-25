# Global Config

The smallweb config is located at `$SMALLWEB_DIR/.smallweb/config.json`.

If `SMALLWEB_DIR` is not set, it defaults to `~/smallweb`.

If you sync the smallweb dir between multiple servers, but want to set different config value depending on the server, you can use env variables to set config value.

```sh
# run smallweb with a different domain that the one set in the config
SMALlWEB_DOMAIN=localhost smallweb up
```

## Available Fields

### `addr`

The `addr` field defines the addr to bind to. By default, it is `:7777`.

```json
{
  "addr": "127.0.0.1:8000"
}
```

If you want to use an unix socket, you can use the `unix/` prefix.

```json
{
  "addr": "unix/~/smallweb.sock"
}
```

### `cert` and `key`

The `cert` and `key` fields define the path to the SSL certificate and key.

```json
{
  "cert": "~/cert.pem",
  "key": "~/key.pem"
}
```

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

## Default Config

By default, the config is as follows:

```json
{
  "addr": ":7777",
  "domain": "localhost"
}
```
