# CLI Reference

## smallweb

Host websites from your internet folder

### Options

```
  -h, --help   help for smallweb
```

## smallweb _carapace



```
smallweb _carapace [flags]
```

### Options

```
  -h, --help   help for _carapace
```

## smallweb _carapace spec



```
smallweb _carapace spec [flags]
```

### Options

```
  -h, --help   help for spec
```

## smallweb _carapace style



```
smallweb _carapace style [flags]
```

### Options

```
  -h, --help   help for style
```

## smallweb _carapace style set



```
smallweb _carapace style set [flags]
```

### Options

```
  -h, --help   help for set
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

## smallweb completion

Generate the autocompletion script for the specified shell

### Synopsis

Generate the autocompletion script for smallweb for the specified shell.
See each sub-command's help for details on how to use the generated script.


### Options

```
  -h, --help   help for completion
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

## smallweb config

Get a configuration value

```
smallweb config <key> [flags]
```

### Options

```
  -h, --help   help for config
```

## smallweb crons

List cron jobs

```
smallweb crons [flags]
```

### Options

```
      --app string   filter by app
  -h, --help         help for crons
      --json         output as json
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

## smallweb doctor

Check the system for potential problems 🩺

```
smallweb doctor [flags]
```

### Options

```
  -h, --help   help for doctor
```

## smallweb edit

Run the edit plugin

```
smallweb edit [flags]
```

### Options

```
  -h, --help   help for edit
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

## smallweb link

Create symbolic links

```
smallweb link <source> <target> [flags]
```

### Options

```
  -h, --help   help for link
```

## smallweb list

List all smallweb apps

```
smallweb list [flags]
```

### Options

```
  -h, --help                   help for list
      --json                   output as json
      --template string        template to use
      --template-file string   template file to use
```

## smallweb logs

View app logs

```
smallweb logs [flags]
```

### Options

```
      --app string        filter by app
  -h, --help              help for logs
      --json              output logs in JSON format
      --template string   output logs using a Go template
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

## smallweb pull

Run the pull plugin

```
smallweb pull [flags]
```

### Options

```
  -h, --help   help for pull
```

## smallweb push

Run the push plugin

```
smallweb push [flags]
```

### Options

```
  -h, --help   help for push
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

## smallweb secrets

Manage app secrets

```
smallweb secrets [app] [flags]
```

### Options

```
  -g, --global        Set global secrets
  -h, --help          help for secrets
      --update-keys   Update all keys
```

## smallweb service

Manage smallweb service

### Options

```
  -h, --help   help for service
```

## smallweb service install

Install smallweb as a service

```
smallweb service install [flags]
```

### Options

```
  -h, --help   help for install
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

## smallweb service restart

Restart smallweb service

```
smallweb service restart [flags]
```

### Options

```
  -h, --help   help for restart
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

## smallweb service status

View service status

```
smallweb service status [flags]
```

### Options

```
  -h, --help   help for status
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

## smallweb service uninstall

Uninstall smallweb service

```
smallweb service uninstall [flags]
```

### Options

```
  -h, --help   help for uninstall
```

## smallweb sync

Sync the smallweb config with the filesystem

```
smallweb sync <target> [flags]
```

### Options

```
  -h, --help   help for sync
```

## smallweb up

Start the smallweb evaluation server

```
smallweb up [flags]
```

### Options

```
      --cron   run cron jobs
  -h, --help   help for up
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



<!-- markdownlint-disable-file -->
