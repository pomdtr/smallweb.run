# Usage

```ts
import { FileServer } from "jsr:@smallweb/file-server";

const fileServer = new FileServer({
    root: "./static",
    transpile: true // automatically transpile ts, jsx, tsx files
});

export default fileServer;
```
