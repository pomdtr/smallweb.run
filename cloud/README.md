---
title: Smallweb Cloud
favicon: https://icons.smallweb.run/smallweb.svg
---

# smallweb.live

> [!WARNING]
> Smallweb Cloud does not exist yet. This is a proposal.

## Introduction

Smallweb cloud will allow to use smallweb without having to buy a VPS or register a domain.

You apps will be available at `https://<app>.<username>.smallweb.live`.

## Authentication

First, you'll need to sign up for an account. You can do this by running the following command:

```sh
# send an email with a confirmation code
ssh accounts@smallweb.live signup --email <email> --user <username>

# confirm the code
ssh accounts@smallweb.live confirm <code>
```

On sucessful signup, smallweb cloud associate your public ssh key with your account.

To link a public key from another device to your account, just run the following command:

```sh
# send an email with a confirmation code
ssh accounts@smallweb.live link <username>

# confirm the code
ssh accounts@smallweb.live confirm <code>
```

## Syncing your local smallweb dir

To edit your apps with your local editor, you'll need to sync your local smallweb directory with the cloud.

```sh
# start the sync
smallweb sync <user>@smallweb.live

# list your apps
smallweb ls
```

---

> [!NOTE]
> Interested in smallweb.live ? Join the [waitlist](https://cloud.smallweb.run).
