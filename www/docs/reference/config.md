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
  // apps will be served at `<app>.example.com`
  "domain": "example.com"
}
```

See the [Routing](../guides/routing.md) guide for more information.

### `additionalDomains`

Additional domains that should be routed to the same smallweb instance.

```json
{
  "domain": "example.com",
  "additionalDomains": [
    // in addition to example.com, apps will be served at `<app>.example.org`
    "example.org",
  ]
}
```

### `authorizedKeys`

List of public ssh keys that are allowed to:

- access the smallweb cli
- access the smallweb sftp server
- access every app `run` entrypoint

```json
{
  "domain": "example.com",
  "authorizedKeys": [
    "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC7Z... user@host"
  ]
}
```

### apps section

This section is used to set app specific config values.

#### `apps.<app>.admin`

Give admin permissions to an app. Admin apps have read/write access to the whole smallweb dir (except the special `.smallweb` dir).

```json
{
  "domain": "example.com",
  "apps": {
    "vscode": {
      "admin": true
    }
  }
}
```

#### `apps.<app>.additionalDomains`

Additional domains that should be routed to the app.

```json
{
  "domain": "example.com",
  "apps": {
    "vscode": {
      "additionalDomains": [
        // in addition to vscode.example.com, the app will be served at vscode.me
        "vscode.me"
      ]
    }
  }
}
```

### `apps.<app>.authorizedKeys`

List of public ssh keys that are allowed to:

- the app `run` entrypoint
- the app directory using sftp

```json
{
  "domain": "example.com",
  "apps": {
    "vscode": {
      "authorizedKeys": [
        "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC7Z... user@host"
      ]
    }
  }
}
```
