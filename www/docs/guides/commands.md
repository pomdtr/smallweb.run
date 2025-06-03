# CLI Commands

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

I personally recommend using [commander.js](https://www.npmjs.com/package/commander) to build complex cli commands.

```ts
import { Command } from 'npm:@commander-js/extra-typings';

export default {
    async run(args: string[]) {
        const program = new Command();

        program
            .option('-n, --name <name>', 'name to greet', 'world')
            .action((options) => {
                console.log(`Hello ${options.name}!`);
            });

        await program.parseAsync(args, { from: 'user' });
    }
}
```
