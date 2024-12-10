# Adding cli commands to your app

To add a cli command to your app, you'll need to add a `run` method to your app's default export.

```ts
// File: ~/smallweb/custom-command/main.ts
export default {
    run(args: string[]) {
        console.log("Hello world");
    }
}
```

Use `smallweb run` to execute the command:

```console
$ smallweb run custom-command
Hello world
```

## Using a cli framework

[Commander.js](https://github.com/tj/commander.js) is a popular cli framework for Node.js.

You can easily wire it to smallweb:

```ts
import { program } from '@commander-js/extra-typings';

export default {
    run(args: string[]) {
        program.action(() => {
            console.log("Hello world");
        });

        await program.parseAsync(args, { from: "user" });
    }
}
```

See the [Commander.js documentation](https://www.npmjs.com/package/commander) for more information.

If you want to open urls in the user's browser, you can checkout the [@smallweb/open](https://jsr.io/@smallweb/open) package.
