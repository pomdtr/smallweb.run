# App Manifest

The smallweb manifest can be defined in a `smallweb.json[c]` file at the root of the project. This file is optional, and sensible defaults are used when it is not present.

## Available Fields

### `entrypoint`

The `entrypoint` field defines the file to serve. If this field is not provided, the app will look for a `main.[js,ts,jsx,tsx]` file in the root directory. If none is found, it will serves the directory statically.

### `root`

The `root` field defines the root directory of the app. If this field is not provided, the app will use the app directory as the root directory.

### `crons`

The `crons` field defines the crons to run. The crons are defined in a JSON array, and each cron is an object with the following fields:

- `args`: The arguments to pass to the cron
- `schedule`: The schedule to run the cron. This is a [cron expression](https://crontab.guru/) that defines when the cron should run.
- `description` (optional): A description of the cron. This is used for documentation purposes only.

```json
{
  "crons": [
    {
      "args": ["arg1", "arg2"],
      "schedule": "0 * * * *",
      "description": "This cron runs every hour"
    }
  ]
}
```

### `private`

Make an app private. Private apps are only accessible to users with the `authorizedEmails` or `authorizedGroups` set in the config.

```json
{
  "private": true
}
```

### `privateRoutes`

List of routes that are private. Private routes are only accessible to users with the `authorizedEmails` or `authorizedGroups` set in the config.

```json
{
  "privateRoutes": [
    "/private/**"
  ]
}
```

### `publicRoutes`

List of routes that are public. Public routes are accessible to everyone, even when the app itself is private.

```json
{
  "private": true,
  "publicRoutes": [
    "/public/**"
  ]
}
```
