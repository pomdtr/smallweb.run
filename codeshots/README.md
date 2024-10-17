# Codeshots

Generate a screenshot of any file in your smallweb directory.

## Installation

```ts
// main.ts
import { codeshots } from "jsr:@pomdtr/codeshots"

export default codeshots();
```

Rename `.env.sample` to `.env` and set the env vars.

Then make sure that the app is private:

```json
// smallweb.json
{
    "private": true
}
```

## Example

![Example](./assets/main_ts.png)

## Usage

- Go to `https://<codeshots-domain>/<app>/<filepath>` to generate a codeshot of any file in your smallweb directory.
