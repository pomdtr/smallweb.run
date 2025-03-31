# Smallweb Types

## Usage

```ts
import type * as smallweb from "jsr:@smallweb/types"

export default {
    fetch: (_req) => new Response("Hello, World!"),
} satisfies smallweb.DefaultExport
```
