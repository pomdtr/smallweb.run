# Git Integration

If your smallweb instance is accessible using [SSH](./ssh.md), you can use git to deploy your apps.

## Setup

Just add a new remote to your git repository:

```sh
$ git init --initial-branch main
# remote syntax: ssh://<app>@<domain>/
$ git remote add example.com ssh://my-app@example.com/
```

## Deploy

Just use the `git push` command to deploy your app:

```sh
git push example.com main
Enumerating objects: 3, done.
Counting objects: 100% (3/3), done.
Writing objects: 100% (3/3), 214 bytes | 214.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0), pack-reused 0

Your app is available at https://my-app.example.com/

To ssh://my-app@example.com/
 * [new branch]      main -> main
branch 'main' set up to track 'example.com/main'.
```
