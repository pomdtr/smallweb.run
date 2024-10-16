# How to use this

## Caddyfile

```txt
smallweb.run, *.smallweb.run {
  tls {
    dns cloudflare {env.CF_API_TOKEN}
  }

  log {
    format json
    output file /home/smallweb/smallweb/logs/logs.jsonl
  }

  reverse_proxy localhost:7777
}
```

Make sure that caddy is able to write to the directory, and your user is able to read the logs created by caddy.
