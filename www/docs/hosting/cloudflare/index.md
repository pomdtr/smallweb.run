Cloudflare Tunnel is a **free** service that allows you to expose your local server to the internet, without having to expose your local IP address.

Additionally, it provides some protection against DDoS attacks, and allows you to use Cloudflare's other services like Access.

## Setup

1. Make sure that you have a domain name that you can manage with Cloudflare.

1. From your cloudflare dashboard, navigate to `Zero Trust > Networks > Tunnels`

1. Click on `Create a tunnel`, and select the `Clouflared` option

1. Follow the intructions to install cloudflared, and create a connector on your device.

1. Add a hostname for your apex domain (ex: `example.com`), and use `http://localhost:7777` as the origin service.

    ![Tunnel Configuration](./tunnel.png)

1. Do the same for your wildcard domain (ex: `*.example.com`). You'll need to then go to the DNS configuration of your domain, and add a `CNAME` record for your wildcard hostname, with a target of `<tunnel-id>.cfargotunnel.com`.

    ![DNS Configuration](./dns.png)

1. Add a new `CNAME` record for your wildcard hostname, with a target of `<tunnel-id>.cfargotunnel.com`.

  ![DNS Configuration](./dns.png)

## Checking that your tunnel is running

Create a dummy smallweb app in `~/smallweb/example`

```sh
mkdir -p ~/smallweb/example
cat <<EOF > ~/smallweb/example/main.ts
export default {
  fetch() {
    return new Response("Smallweb is running");
  }
}
EOF
```

If everything went well, you should be able to access `https://example.<your-domain>` in your browser, and see the message `Smallweb is running`.

## Optional Steps

- You can protect your tunnel (or specific apps) with Cloudflare Access.
