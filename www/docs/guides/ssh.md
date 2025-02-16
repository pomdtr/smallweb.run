# SSH Server

Smallweb includes a built-in SSH server. In order to use it, you must provide the `--ssh-addr` flag when starting smallweb:

```sh
smallweb up --ssh-addr :2222
```

## Authentication

To access the SSH server, you'll need to add your public key the `$SMALLWEB_DIR/.smallweb/authorized_keys` file.

You can also put a public key `$SMALLWEB_DIR/<app-name>/authorized_keys` to allow access to a specific app.

### Usage

The ssh server use the username to route commands to the correct app:

- `_` is the username for the smallweb cli (and maps to the `$SMALLWEB_DIR` when using `sftp`)
- `<app-name>` is the username for an app (and maps to the `$SMALLWEB_DIR/<app-name>` when using `sftp`)

```sh
# list smallweb apps using the smallweb cli
ssh -p 2222 _@<your-domain> ls

# run the smallblog app cli
ssh -p 2222 smallblog@<your-domain>
```

You can interact with your smallweb dir using the whole range of ssh tools:

- accessing the smallweb cli: `ssh -p 2222 _@<your-domain>`
- accessing an app cli: `ssh -p 2222 <app-name>@<your-domain>`
- editing your smallweb dir using [lftp](https://lftp.yar.ru/): `lftp sftp://_:@<your-domain>:2222`
- mounting an app dir using ssfs:

  ```sh
  mkdir ~/my-smallweb-app && sshfs -p 2222 <app-name>@<your-domain>:/ ~/my-smallweb-app
  ```
