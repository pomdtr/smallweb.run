# App Manifest

The smallweb manifest can be defined in a `smallweb.json[c]` file at the root of the project. This file is optional, and sensible defaults are used when it is not present.

## Available Fields

### `entrypoint`

The `entrypoint` field defines the file to serve. If this field is not provided, the app will look for a `main.[js,ts,jsx,tsx]` file in the root directory. If none is found, it will serves the directory statically.

### `root`

The `root` field defines the root directory of the app. If this field is not provided, the app will use the app directory as the root directory.

### `crons`

The `crons` field defines the cron jobs for the app. See [Cron Jobs](../guides/cron.md) for more information.
