# Smallweb TODO

This website list what's next for [smallweb](https://smallweb.run).

You can view the source at <https://github.smallweb.run/todo/main.ts>.

## Add a TMP dir

## Smallweb SDK

Instead of a rest api, smallweb should include a sdk, that interact directly with the filesystem.

## `edit` command

Add a way to edit a file from the cli using the system editor.

## `smallweb env`

I want to provide a sync solution for smallweb, but I don't want to be responsible for secrets.

In order to fix this, i'll introduce a set of commands under `smallweb env`.

To get started, you'll need to generate a public/private key pair using:

```sh
smallweb env init
```

It will add the public key to your global config:

```json
{
  "publicKey": "03670bf3924361d8e943536d6596bac9e2cd9a65c05f35d1ce48f137272adff1ae"
}
```

and print the private key to stdout, that you'll add in your shell init file:

```sh
export SMALLWEB_PRIVATE_KEY="ba5553adb7ad1509e48a271d152f92ff150896beae20e6d884474abae761e7af"
```

From now on, you'll be able to add encrypted env vars to your `.env` files by running:

```sh
# smallweb env set <key> <value>
$ smallweb env set GITHUB_TOKEN "ghp_1234567890"
```

And it will add the following value to your `.env`:

```txt
GITHUB_TOKEN="encrypted:BNca6YgAAhbdZOm6pifoX0MOfpTdquHe8sMpQZN+VHp9DLo2LpmhRoc1emp99BDta8xU/J9Y8zO5iko/+HrLKxxfXXfAv1nRvVV0ZuhLk+4mcbHl7eqpbFhn5ZBpHzi2e+eSh2nn"
```

To get the value of your token, just run:

```sh
$ smallweb env get GITHUB_TOKEN
ghp_1234567890
```

I'm thinking of using [Secp256k1](https://en.bitcoin.it/wiki/Secp256k1).

## Automatically install deno for the user

## `smallweb sync` (wrapper over mutagen)

```sh
mutagen sync create \
  --name=smallweb \
  --ignore-vcs \
  --ignore=node_modules \
  --mode=two-way-resolved \
  --stage-mode-alpha=internal \
  <token>@ssh.smallweb.run:/var/www/<user> ~/smallweb
```

## Adaptor for [blot.im](https://blot.im) websites

## Automatic backups to github / git repository

## Integrations

### Raycast Extension

https://github.com/pomdtr/smallweb-raycast

### VS Code Extension

## Website Redesign

The website was built in a rush. I'm planning to use [starlight](https://starlight.astro.build/) for the homepage, docs and blog.

## Record youtube videos for smallweb

I need to show the world the capabilities of smallweb, and the way I'm using it. I'll start a youtube channel to do so.

## Improved logs (done)

Currently, logs are awful. In the future, they will be accessible as a stream at` https://<api-domain>/v0/logs` (allowing you to access them from any client).

You'll also be able to access them using the CLI:

```sh
smallweb logs --app <app> --type [http|cron|console]
```
