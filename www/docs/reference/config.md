---
outline: [2, 3]
---

# Global Config

The smallweb config is located at `$SMALLWEB_DIR/.smallweb/config.json`.

If `SMALLWEB_DIR` is not set, it defaults to `~/smallweb`.

Only the `domain` field is required. The rest are optional.

## `domain`

The `domain` field defines the apex domain used for routing. By default, it is `localhost`.

```json
{
  // apps will be served at `<app>.example.com`
  "domain": "example.com"
}
```

See the [Routing](../guides/routing.md) guide for more information.

The smallweb domain can be overriden by using the `--domain` flag when running the smallweb CLI.

```sh
smallweb up --domain smallweb.localhost
```

## `additionalDomains`

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

## `authorizedKeys`

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

## `authorizedEmails`

List of emails that are allowed to access all private apps.

```json
{
  "domain": "example.com",
  "authorizedEmails": [
    "achille.lacoin@gmail.com"
  ]
}
```

## `authorizedGroups`

List of groups that are allowed to access all private apps.

```json
{
  "domain": "example.com",
  "authorizedGroups": [
    "admin"
  ]
}
```

## apps section

This section is used to set app specific config values.

### `apps.<app>.admin`

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

### `apps.<app>.authorizedEmails`

List of emails that are allowed to access a specific app.

```json
{
  "domain": "example.com",
  "apps": {
    "vscode": {
      "private": true,
      "authorizedEmails": [
        "achille.lacoin@gmail.com"
      ]
    }
  }
}
```

### `apps.<app>.authorizedGroups`

List of groups that are allowed to access all private apps.

```json
{
  "domain": "example.com",
  "authorizedGroups": [
    "admin"
  ],
  "apps": {
    "vscode": {
      "private": true,
      "authorizedGroups": [
        "dev"
      ]
    }
  }
}
```

### `apps.<app>.additionalDomains`

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

## `oidc` section

### `oidc.issuer`

The issuer of the OIDC provider. This is used to verify if a user is allowed to access a private app.

```json
{
  "domain": "example.com",
  "oidc": {
    "issuer": "https://lastlogin.net"
  }
}
```
