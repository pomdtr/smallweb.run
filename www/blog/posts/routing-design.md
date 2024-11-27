---
title: Rethinking Smallweb Routing
aside: false
prev: false
next: false
date: 2024-07-11
author: Achille Lacoin
tags:
  - article
---

Smallweb `v0.8.0` was released yesterday, and it included the first smallweb
breaking change.

> The `~/www` convention was dropped, the defaut folder is now `~/smallweb`
>
> In addition to this change, the folder should now be named after the hostname:
>
> - example.smallweb.run => ~/smallweb/example.smallweb.run/
> - pomdtr.me => ~/smallweb/pomdtr.me/
> - example.localhost => ~/smallweb/example.localhost/

This change was not really well received:

> I'm not a fan of the new hostname folder convention. It feels noisy.
>
> I'm also a bit frustrated by this change, and this is my main gripe with it
> too. And this "ugliness" is (for me) exacerbated by the fact that there's
> going to be a lot of repetition if all my smallweb apps are `<app>.localhost`.
> I would prefer a convention like `~/smallweb/localhost/example` mapping to
> `example.localhost`

In this post, I'll try to address:

- the drawbacks of the previous convention
- the options I've considered

<!-- more -->

## Why a change was needed

The smallweb routing system was originally designed for a single usecase:
hosting a unlimited amount of websites locally, using `*.localhost` domains.

The convention was to:

- store all of your website in the smallweb root (`~/www` by default)
- use the folder name has the subdomain

So `~/www/example/` would be mapped to `https://example.localhost`.

As the project expanded, new usecases emerged for smallweb: hosting smallweb on
a raspberrypi, or even on a VPS from hetzner/digital ocean...

And the intitial design hold quite well with these usecases. You would just
assign a domain to your device (ex: `*.pomdtr.me`), and `~/www/example/` would
map to `https://example.pomdtr.me`.

But what if I wanted to assign multiple domains to a single machine ? If I route
both `*.pomdtr.me` and `*.smallweb.run` to my machine, `~/www/example` will
match both `https://example.pomdtr.me` and `https://example.smallweb.run`. This
is probably not what the user want in most cases.

## Options I've considered

Let's say we want to manage the following websites using smallweb.

- `https://smallweb.run`
- `https://readme.smallweb.run`
- `https://assets.smallweb.run`
- `https://pomdtr.me`
- `https://example.localhost`
- `https://react.localhost`

We'll assume that all of these websites are defined in a single `main.ts`.

### Option 1: Not using the folder name

We could just allow arbitrary folder names, and just use a CNAME at the root of
the app, specifying the domain name.

```txt
assets.smallweb.run
```

It sounds like a fine solution, but it means that every smallweb website would
need to include it. I really want single-file websites to be able to exist, and
I feel like file based routing is a core feature of smallweb, so I did not go
with this option.

### Option 2: Using a Nested structure

```txt
/
├── localhost
│   ├── example
│   │   └── main.ts
│   └── react
│       └── main.ts
├── me
│   └── pomdtr
│       └── main.ts
└── run
    └── smallweb
        ├── main.ts
        ├── assets
        │   └── main.ts
        └── readme
            └── main.ts
```

Of course, this is not acceptable. If we look at the `/run/smallweb` folder, we
can see that it contains both:

- the code of the `https://smallweb.run` homepage at his root.
- the code of `readme` and `assets` subdomains

If we used a git repository to manage each of those websites, this would quickly
become a mess.

To counter this, we can add a convention: if the request target a root domain,
it will be automatically redirected to the `www` domain.

```txt
/
├── localhost
│   ├── example
│   │   └── main.ts
│   └── react
│       └── main.ts
├── me
│   └── pomdtr
│       └── www
│           └── main.ts
└── run
    └── smallweb
        ├── assets
        │   └── main.ts
        ├── readme
        │   └── main.ts
        └── www
            └── main.ts
```

This looks better! However, it still feels like we have some uncessary nesting.

For example, the `/run` folder only has one subfolder: `/run/smallweb`. Folders
are supposed to group related websites, but websites sharing the same TLD
probably have nothing in common.

Even worse, `pomdtr.me` requires 3 (!!!) level of nesting: `/me/pomdtr/www`.

### Option 3: 2-level structure

Instead of splitting on `.`, we'll use the apex domain as the first level of
subfolder, and the subdomain as the second one.

If a request target the apex domain, will automatically redirect it to the `www`
subdomain.

```txt
/
├── localhost
│   ├── example
│   │   └── main.ts
│   └── react
│       └── main.ts
├── pomdtr.me
│   └── www
│       └── main.ts
└── smallweb.run
    ├── www
    │   └── main.ts
    ├── assets
    │   └── main.ts
    └── readme
        └── main.ts
```

We still have some uncessary nesting (`pomdtr/www`), but we get meaningful
groups in exchange.

Here the folder structure kind of reflect the process of updating DNS records in
cloudflare.

### Option 4: Flat structure

Let's drop the nesting, and use the domain name as the folder name:

```txt
/
├── assets.smallweb.run
│   └── main.ts
├── example.localhost
│   └── main.ts
├── pomdtr.me
│   └── main.ts
├── react.localhost
│   └── main.ts
├── readme.smallweb.run
│   └── main.ts
└── smallweb.run
    └── main.ts
```

Using the domain name as the folder looks kind of ugly, but it avoid the nested
folders problem entirely. One big advantage of this architecture is that you can
create a new website from a git repository by just doing:

```sh
git clone <repo-url> <hostname>
```

My main gripe with it (outside of the noisy folder names), is that related
websites appears in different places in the file tree (ex: `react.localhost` and
`example.localhost` are not next to each others).

We can fix it by reversing the folder names:

```txt
/
├── localhost.example
│   └── main.ts
├── localhost.react
│   └── main.ts
├── me.pomdtr
│   └── main.ts
├── run.smallweb
│   └── main.ts
├── run.smallweb.assets
│   └── main.ts
└── run.smallweb.readme
    └── main.ts
```

I quite like this compromise, but I'm not sure it would address the noisyness
reported by the community.

## What do you think ?

Here are the two options I'm considering as default:

1. 2-level structure
1. Reversed Flat structure

Writing this article, I've come to gain more appreciation of the two
level-structure, as it mirrors the process of setting up DNS record in your
domain registrar. However, the reversed flat structure is far more
straightforward, which is a plus in my book.

I wonder if we should support both options (remix-style).

I would love to hear your thoughts on all of this. Make sure to join the
[discord channel](https://discord.gg/36jsj3rS) if you want your voice to be
heard.
