---
title: Why smallweb?
sidebar: false
prev: false
aside: false
next: false
author: Achille Lacoin
tags:
    - article
---

Think about the last time you worked on a local project. You probably had to:

1. Open your project in your favorite editor
1. Start a development server
1. Open your browser and navigate to `http://localhost:3000` or any other port

There are a few things that are not great about this workflow:

1. You have to go through a few manual steps to start your project. Why can't it be running all the time?
1. Multiple projects can't run on the same port. You have to remember which project is running on which port.
1. Using `http://` is very limiting. For example, you can't install a PWA if it's not served over HTTPS.

<!-- more -->

## Why can't it be running all the time?

An elegant way to address some of these issues is to use a reverse proxy like caddy, and self-signed certificates. Your proxy configuration would look something like this:

```txt
website.localhost {
  tls internal {
    on_demand
  }

  reverse_proxy localhost:3000
}
```

By setting up a reverse proxy, you can access your project using `https://website.localhost` instead of `http://localhost:3000`. This is a great improvement, but it's still not perfect: you still have to manually start your project.

At this point you might be tempted to write a service that starts your project when you boot your computer. But this becomes cumbersome really fast, and it will end up consuming a lot of resources (each project on computer would be running all the time).

## Taking inspiration from Serverless

Platforms like [Vercel](https://vercel.com), [Deno Deploy](https://deno.com/deploy) or [Val Town](https://val.town) allow each user to host a unlimited amount of websites for free. How can they afford to do that? They don't run your code all the time. Instead, they start a new process when a request comes in, and they shut it down when it's done.

This sounds like a great idea, could we do the same thing, but self-hosted? This is the idea behind smallweb.

Instead of having all project running at all time, we will only have a single smallweb evaluation server running on port 7777.

```txt
*.localhost {
  tls internal {
    on_demand
  }

  reverse_proxy localhost:7777
}
```

When a new request comes in, smallweb will map the hostname to a folder in your filesystem:

```txt
website.localhost -> ~/localhost/website
```

Smallweb will then start a new process, and look for a `main.ts` file in the folder. If it finds one, it will evaluate it and proxy the response back.

```ts
// ~/localhost/website/main.ts

export default {
    fetch: (req: Request) => new Response("Hello, World!")
}
```

```console
$ curl https://website.localhost
Hello, World!
```

## Managing servers with unix commands

Since hostnames are mapped to folders in your filesystem, you can use unix commands to manage your servers.

For example, you can clone a website by copying the folder:

```sh
$ cp -r ~/localhost/website ~/localhost/website-clone
$ curl https://website-clone.localhost
Hello, World!
```

If you want to rename it, use the `mv` command. To delete it, use the `rm` command.

## Running smallweb on the Server

I've focused on the local dev experience so far, but there is nothing stopping you from running smallweb on a server.

In fact, this is how I host this blog, and every other `smallweb.run` websites from a 5$ Hetzner VPS.

With smallweb running on my server, I can host as many websites as I want, as the amount of resouces consumed depends on the amount of traffic I get, not the amount of websites I have.

As much my websites don't have any visitors, this is probably the right tradeoff to make 😅.
