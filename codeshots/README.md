# Serve Snippets

Usage: Store your snippets in a directory (ex: `shots`), then serve them using:

```ts
import { codeshots } from "jsr:@pomdtr/codeshots@{version}";

export default {
    fetch: codeshots("./src")
}
```

## Example Structure

```txt
.
├── main.ts
└── src
    └── example.json
```

Go to `http://localhost:8000/example.json` to get a screenshot of the the `src/example.json` file.
