---
next: false
prev: false
---

# Examples

> [!TIP]
> Every website hosted under the `smallweb.run` domain are open source and can be found on [GitHub](https://github.com/pomdtr/smallweb.run). For example, the source code of this website is available [here](https://github.com/pomdtr/smallweb.run/tree/main/www).

## Smallblog

An easy-to-use blog engine for smallweb created by [Tayzen](https://github.com/tayzendev).

### Demo

<https://smallblog-demo.tayzen.dev>

### Code

```ts
// ~/smallweb/smallblog-demo/main.ts

import { Smallblog } from "jsr:@tayzendev/smallblog@1.1.5";

export default new Smallblog();
```

## Excalidraw

A port of Excalidraw for smallweb. Files are stored in the app `data` folder.

### Demo

<https://excalidraw-demo.smallweb.run>

```ts
// ~/smallweb/excalidraw/main.ts

import { Excalidraw } from "jsr:@smallweb/excalidraw@0.8.1";

const excalidraw = new Excalidraw({
    rootDir: "./data"
});

export default excalidraw;
```

## VS Code

A port of VS Code for smallweb. Files are stored in the app `data` folder.

### Demo

<https://vscode-demo.smallweb.run>

### Code

```ts
// ~/smallweb/vscode/main.ts

import { VSCode } from "jsr:@smallweb/vscode@0.0.9"

const vscode = new VSCode({
    rootDir: "./data"
});

export default vscode;
```
