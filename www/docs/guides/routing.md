# Routing

Smallweb maps every subdomains of your root domain to a directory in your root directory.

For example with, the following configuration:

```json
// ~/smallweb/.smallweb/config.json
{
    "domain": "example.com"
}
```

The routing system maps domains to directories as follows:

- Direct subdomain mapping:
  - `api.example.com` → `~/smallweb/api`
  - `blog.example.com` → `~/smallweb/blog`

- Root domain behavior:
  - Requests to `example.com` automatically redirect to `www.example.com` if the `www` directory exists
  - If the `www` directory does not exist, a 404 error is returned

## Naming constraints

Subdomains must be alphanumeric, and can contain hyphens. You should also avoid using uppercase letters in your subdomains, as they are usually converted to lowercase. Underscores are allowed, but not recommended.

Any folder starting with `.` is ignored by the routing system. You can use it to your advantage to create hidden directories that are not accessible from the web (ex: `.github`, or `.data`).
