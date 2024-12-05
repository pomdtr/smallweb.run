# Logs

Use the `smallweb logs` command to view logs for your whole smallweb instance.

You can also view logs for a specific app by passing the app name as an flag.

```bash
smallweb logs --app=appname
```

If you want to view console logs instead, you can use the `--console` flag.

```bash
smallweb logs --console
```

> ![WARNING] The `smallweb logs` command should be run on the machine where the smallweb evaluation server is running. If you are using a VPS, you should use the `ssh` command to connect to the server and run the `smallweb logs` command.
