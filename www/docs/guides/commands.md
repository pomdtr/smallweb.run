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

## Accessing stdin

You can access stdin by using the optional input argument of the `run` method.

```ts
// File: ~/smallweb/custom-command/main.ts
export default {
    run(_args: string[], input: ReadableStream) {
        console.log("You just piped:");
        console.log(input);
    }
}
```

## Using a cli framework

I personally recommend using [gunshi](https://www.npmjs.com/package/gunshi) to build complex cli commands.

```ts
import { cli } from 'npm:gunshi@0.17.0'

export default {
    async run(args: string[]) {
        await cli(args, {
            options: {
                name: {
                    type: "string",
                    default: "world",
                }
            },
            run: (ctx) => {
                console.log(`Hello ${ctx.values.name}!`)
            }
        })
    }
}
```
