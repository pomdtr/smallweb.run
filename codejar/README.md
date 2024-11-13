# Smallweb Codejar

```ts
// ~/smallweb/editor/main.ts
import { Codejar } from "jsr:@pomdtr/codejar";
import { lastlogin } from "jsr:@pomdtr/lastlogin";

const codejar = new Codejar();
codejar.fetch = lastlogin(codejar.fetch);

export default codejar
```
