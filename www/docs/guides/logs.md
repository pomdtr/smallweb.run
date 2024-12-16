# Logs

Use the `smallweb logs` command to view logs for your whole smallweb instance.

You can also view logs for a specific app by passing the app name as an argument.

```bash
smallweb logs smallblog
```

If you run the command from an app directory, you can omit the app name.

```bash
smallweb logs
```

If you want to view console logs instead, you can use the `--type` flag.

```bash
smallweb logs smallblog --type=console
```

To access the logs from a remote machine, you can use the `--remote` flag.

```bash
smallweb logs --remote <remote>
```

You can use any host from your `.ssh/config` file as the remote. Behind the scenes, `smallweb logs` will uses `ssh` to connect to the remote machine and fetch the logs.
