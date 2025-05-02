# Cron Jobs

Cron jobs are a way to schedule jobs to run at specific times.

You can define cron jobs in your app manifest file, which is located in the app's directory.

```json
// ~/smallweb/hello/smallweb.json
{
  "crons": [
    {
      "schedule": "0 0 * * *",
      "args": ["pomdtr"]
    }
  ]
}
```

This cron job will trigger the [cli entrypoint](./commands.md) of the `hello` app every day at midnight, with the argument `pomdtr`.

```ts
// ~/smallweb/hello/main.ts
export default {
  run: async (args: string[]) => {
    console.log(`Hello ${args[0]}`);
  },
};
```

You can trigger it manually by just using the `smallweb run hello pomdtr` command.
