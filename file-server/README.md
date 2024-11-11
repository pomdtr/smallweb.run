# Usage

```ts
import { FileServer } from "jsr:@smallweb/file-server";

const fileServer = new FileServer({
    root: "./static",
    transform: true // automatically compile ts, jsx, tsx files
});

export default fileServer;
```
