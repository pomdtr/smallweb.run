# VS Code

```ts
// ~/smallweb/vscode/main.ts
import { VSCode } from "jsr:@smallweb/vscode";

const vscode = new VSCode();

export default vscode;
```

```sh
# ~/smallweb/vscode/.env
VSCODE_TOKEN=my-secret-token
```

```json
// settings.json
{
    "smallweb.tokens": {
        "vscode.<your-domain>": "my-secret-token"
    }
}
```
