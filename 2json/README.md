# 2json

## Usage

This service fetch a response from a given URL, and convert it to a JSON object:

```txt
https://{{hostname}}/<target-url>
```

For example, to convert the [example.com](https://example.com) to JSON, use:

```txt
https://{{hostname}}/example.com
```

## Why ?

Deno automatically cache the imported modules, meaning that you can use this service to build clone of static websites in no-time.

```ts
import page from "https://{{hostname}}/example.com" with { type: "json" };
import { decodeBase64 } from "jsr:@std/encoding@0.224.3/base64";

export default {
    fetch() {
        return new Response(decodeBase64(page.body), {
            headers: page.headers,
            status: page.status,
            statusText: page.statusText,
        });
    }
}
```

I use this technique to host old version of documentation websites hosted on Github Pages (ex: [Mkdocs from 8 years ago](https://www.val.town/v/pomdtr/old_mkdocs)).

## Source

[View Source](https://{{hostname}}/src/main.ts)
