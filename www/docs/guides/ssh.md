# SSH Server

Smallweb includes a built-in SSH server. In order to use it, you must provide the `--ssh-addr` flag when starting smallweb:

```sh
smallweb up --ssh-addr :2222
```

## Authentication

To access the SSH server, you'll need to add your public key in the `~/.smallweb/config.json` file:

```json
{
  "domain": "example.com",
  "authorizedKeys": [
    "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC7..."
  ]
}
```

You can also map a public key to a specific app:

```json
{
  "domain": "example.com",
  "apps": {
    "smallblog": {
      "authorizedKeys": [
        "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC7..."
      ]
    }
  }
}
```

### Usage

The ssh server use the username to route commands to the correct app:

- `_` is the username for the smallweb cli (and maps to the `$SMALLWEB_DIR` when using `sftp`)
- `<app-name>` is the username for an app (and maps to the `$SMALLWEB_DIR/<app-name>` when using `sftp`)

```sh
# list smallweb apps using the smallweb cli
ssh -p 2222 _@example.com ls

# run the smallblog app cli
ssh -p 2222 smallblog@example.com ls
```

You can interact with your smallweb dir using the whole range of ssh tools:

- accessing the smallweb cli: `ssh -p 2222 _@example.com`
- accessing an app cli: `ssh -p 2222 <app-name>@example.com`
- editing your smallweb dir using [lftp](https://lftp.yar.ru/): `lftp sftp://_:@example.com:2222`
- mounting an app dir using ssfs:

  ```sh
  mkdir ~/my-smallweb-app && sshfs -p 2222 <app-name>@example.com:/ ~/my-smallweb-app
  ```

It's a good idea to add an alias to your `~/.ssh/config` file:

```sh
Host example.com
  Port 2222
  User _
```

Then you can just run `ssh example.com` to access the smallweb cli.
