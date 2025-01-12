# CLI Reference

## smallweb

Host websites from your internet folder

```
smallweb [flags]
```

### Options

```
      --dir string   The root directory for smallweb
  -h, --help         help for smallweb
```

## smallweb _carapace



```
smallweb _carapace [flags]
```

### Options

```
  -h, --help   help for _carapace
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb _carapace spec



```
smallweb _carapace spec [flags]
```

### Options

```
  -h, --help   help for spec
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb _carapace style



```
smallweb _carapace style [flags]
```

### Options

```
  -h, --help   help for style
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb _carapace style set



```
smallweb _carapace style set [flags]
```

### Options

```
  -h, --help   help for set
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb changelog

Show the changelog

```
smallweb changelog [flags]
```

### Options

```
  -h, --help   help for changelog
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb completion

Generate the autocompletion script for the specified shell

### Synopsis

Generate the autocompletion script for smallweb for the specified shell.
See each sub-command's help for details on how to use the generated script.


### Options

```
  -h, --help   help for completion
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb completion bash

Generate the autocompletion script for bash

### Synopsis

Generate the autocompletion script for the bash shell.

This script depends on the 'bash-completion' package.
If it is not installed already, you can install it via your OS's package manager.

To load completions in your current shell session:

	source <(smallweb completion bash)

To load completions for every new session, execute once:

#### Linux:

	smallweb completion bash > /etc/bash_completion.d/smallweb

#### macOS:

	smallweb completion bash > $(brew --prefix)/etc/bash_completion.d/smallweb

You will need to start a new shell for this setup to take effect.


```
smallweb completion bash
```

### Options

```
  -h, --help              help for bash
      --no-descriptions   disable completion descriptions
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb completion fish

Generate the autocompletion script for fish

### Synopsis

Generate the autocompletion script for the fish shell.

To load completions in your current shell session:

	smallweb completion fish | source

To load completions for every new session, execute once:

	smallweb completion fish > ~/.config/fish/completions/smallweb.fish

You will need to start a new shell for this setup to take effect.


```
smallweb completion fish [flags]
```

### Options

```
  -h, --help              help for fish
      --no-descriptions   disable completion descriptions
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb completion powershell

Generate the autocompletion script for powershell

### Synopsis

Generate the autocompletion script for powershell.

To load completions in your current shell session:

	smallweb completion powershell | Out-String | Invoke-Expression

To load completions for every new session, add the output of the above command
to your powershell profile.


```
smallweb completion powershell [flags]
```

### Options

```
  -h, --help              help for powershell
      --no-descriptions   disable completion descriptions
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb completion zsh

Generate the autocompletion script for zsh

### Synopsis

Generate the autocompletion script for the zsh shell.

If shell completion is not already enabled in your environment you will need
to enable it.  You can execute the following once:

	echo "autoload -U compinit; compinit" >> ~/.zshrc

To load completions in your current shell session:

	source <(smallweb completion zsh)

To load completions for every new session, execute once:

#### Linux:

	smallweb completion zsh > "${fpath[1]}/_smallweb"

#### macOS:

	smallweb completion zsh > $(brew --prefix)/share/zsh/site-functions/_smallweb

You will need to start a new shell for this setup to take effect.


```
smallweb completion zsh [flags]
```

### Options

```
  -h, --help              help for zsh
      --no-descriptions   disable completion descriptions
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb config

Get a configuration value

```
smallweb config <key> [flags]
```

### Options

```
  -h, --help   help for config
      --json   Output as JSON
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb crons

List cron jobs

```
smallweb crons [app] [flags]
```

### Options

```
      --all    show all cron jobs
  -h, --help   help for crons
      --json   output as json
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb docs

Generate smallweb cli documentation

```
smallweb docs [flags]
```

### Options

```
  -h, --help   help for docs
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb doctor

Check the system for potential problems

```
smallweb doctor [flags]
```

### Options

```
  -h, --help   help for doctor
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb fetch

Fetch a path from an app

```
smallweb fetch <app> [path] [flags]
```

### Options

```
  -d, --data string          Data to send in the request body. Use @- to read from stdin
  -H, --header stringArray   HTTP headers to use
  -h, --help                 help for fetch
  -X, --method string        HTTP method to use (default "GET")
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb init

Initialize a new workspace

```
smallweb init <domain> [flags]
```

### Options

```
  -h, --help   help for init
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb link

Create symbolic links

```
smallweb link <source> <target> [flags]
```

### Options

```
  -h, --help   help for link
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb list

List all smallweb apps

```
smallweb list [flags]
```

### Options

```
      --admin                  filter by admin
  -h, --help                   help for list
      --json                   output as json
      --template string        template to use
      --template-file string   template file to use
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb logs

View app logs

```
smallweb logs [app] [flags]
```

### Options

```
      --all               show logs for all apps
  -h, --help              help for logs
      --template string   output logs using a Go template
      --type string       log type (http, console) (default "http")
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb open

Open an app in the browser

```
smallweb open [app] [flags]
```

### Options

```
  -h, --help   help for open
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb run

Run an app cli

```
smallweb run <app> [args...] [flags]
```

### Options

```
  -h, --help   help for run
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb secrets

Manage app secrets

```
smallweb secrets [app] [flags]
```

### Options

```
      --dotenv        Output as dotenv
  -g, --global        Set global secrets
  -h, --help          help for secrets
      --json          Output as JSON
      --update-keys   Update all keys
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb service

Manage smallweb service

### Options

```
  -h, --help   help for service
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb service install

Install smallweb as a service

```
smallweb service install [args...] [flags]
```

### Options

```
  -h, --help   help for install
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb service logs

Print service logs

```
smallweb service logs [flags]
```

### Options

```
  -f, --follow   Follow log output
  -h, --help     help for logs
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb service restart

Restart smallweb service

```
smallweb service restart [flags]
```

### Options

```
  -h, --help   help for restart
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb service start

Start smallweb service

```
smallweb service start [flags]
```

### Options

```
  -h, --help   help for start
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb service status

View service status

```
smallweb service status [flags]
```

### Options

```
  -h, --help   help for status
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb service stop

Stop smallweb service

```
smallweb service stop [flags]
```

### Options

```
  -h, --help   help for stop
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb service uninstall

Uninstall smallweb service

```
smallweb service uninstall [flags]
```

### Options

```
  -h, --help   help for uninstall
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb sync

Sync the smallweb config with the filesystem

```
smallweb sync <remote> [flags]
```

### Options

```
  -h, --help          help for sync
      --name string   The name of the sync session
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb up

Start the smallweb evaluation server

```
smallweb up [flags]
```

### Options

```
      --addr string           address to listen on
      --cert string           tls certificate file
      --cron                  enable cron jobs
  -h, --help                  help for up
      --key string            key file
      --on-demand-tls         enable on-demand TLS
      --ssh-addr string       address to listen on for ssh/sftp
      --ssh-host-key string   ssh host key (default "~/.ssh/smallweb")
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```

## smallweb upgrade

Upgrade to the latest version

```
smallweb upgrade [version] [flags]
```

### Options

```
  -h, --help   help for upgrade
```

### Options inherited from parent commands

```
      --dir string   The root directory for smallweb
```



<!-- markdownlint-disable-file -->
