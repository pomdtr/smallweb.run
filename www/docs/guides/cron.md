# Cron Jobs

Cron jobs are a way to schedule tasks to run at specific times.
You can define cron jobs in the `smallweb.json[c]` file at the root of your app.

```json
// ~/smallweb/hello-world/smallweb.json
{
    "crons": [
        {
            "name": "hello-world",
            "description": "A simple cron job", // Optional
            "schedule": "0 0 * * *",
            "args": ["hello", "world"]
        }
    ]
}
```

This cron job will trigger the [cli entrypoint](./commands.md) of the `hello-world` app every day at midnight, with the arguments `hello` and `world`.
