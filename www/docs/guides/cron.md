# Cron Jobs

Cron jobs are a way to schedule tasks to run at specific times.
You can define cron jobs in your global config.

```json
// $SMALLWEB_DIR/.smallweb/config.json
{
    "apps": {
        "hello": {
            "crons": [{
                "schedule": "0 0 * * *",
                "args": ["pomdtr"]
            }]
        }
    }
}
```

This cron job will trigger the [cli entrypoint](./commands.md) of the `hello` app every day at midnight, with the argument `pomdtr`.

You can trigger it manually by just using the `smallweb run hello pomdtr` command.
