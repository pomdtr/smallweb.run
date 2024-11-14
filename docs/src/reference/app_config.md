# App Configuration Reference

The smallweb configuration can be defined in a `smallweb.json[c]` file at the root of the project. This config file is optional, and sensible defaults are used when it is not present.

## Available Fields

### `entrypoint`

The `entrypoint` field defines the file to serve. If this field is not provided, the app will look for a `main.[js,ts,jsx,tsx]` file in the root directory.

### `root`

The `root` field defines the root directory of the app. If this field is not provided, the app will use the app directory as the root directory.

### `admin`

The `admin` field defines wether the app is an admin app. Admin apps have read/write access the whole smallweb directory.

### `crons`

The `crons` field defines the cron jobs for the app. See [Cron Jobs](../guides/cron.md) for more information.
