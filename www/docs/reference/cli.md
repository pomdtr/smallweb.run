# CLI Reference

## smallweb

Host websites from your internet folder

```
smallweb [flags]
```

### Options

```
      --dir string      The root directory for smallweb
      --domain string   The domain for smallweb
  -h, --help            help for smallweb
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
      --dir string      The root directory for smallweb
      --domain string   The domain for smallweb
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
      --dir string      The root directory for smallweb
      --domain string   The domain for smallweb
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
      --dir string      The root directory for smallweb
      --domain string   The domain for smallweb
```

## smallweb init

Initialize a new workspace

```
smallweb init [flags]
```

### Options

```
  -h, --help   help for init
```

### Options inherited from parent commands

```
      --dir string      The root directory for smallweb
      --domain string   The domain for smallweb
```

## smallweb link

Create symbolic links

```
smallweb link <source> <target> [flags]
```

### Options

```
  -f, --force   Force overwrite existing symlinks
  -h, --help    help for link
```

### Options inherited from parent commands

```
      --dir string      The root directory for smallweb
      --domain string   The domain for smallweb
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
      --dir string      The root directory for smallweb
      --domain string   The domain for smallweb
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
      --dir string      The root directory for smallweb
      --domain string   The domain for smallweb
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
      --dir string      The root directory for smallweb
      --domain string   The domain for smallweb
```

## smallweb secrets

Print app secrets

```
smallweb secrets [app] [flags]
```

### Options

```
      --dotenv   Output as dotenv
  -h, --help     help for secrets
      --json     Output as JSON
```

### Options inherited from parent commands

```
      --dir string      The root directory for smallweb
      --domain string   The domain for smallweb
```

## smallweb up

Start the smallweb evaluation server

```
smallweb up [flags]
```

### Options

```
      --addr string              address to listen on
      --enable-crons             enable cron jobs
  -h, --help                     help for up
      --log-format string        log format (json or text) (default "pretty")
      --smtp-addr string         address to listen on for smtp
      --ssh-addr string          address to listen on for ssh/sftp
      --ssh-private-key string   ssh private key
      --tls-cert string          tls certificate file
      --tls-key string           tls key file
```

### Options inherited from parent commands

```
      --dir string      The root directory for smallweb
      --domain string   The domain for smallweb
```



<!-- markdownlint-disable-file -->
