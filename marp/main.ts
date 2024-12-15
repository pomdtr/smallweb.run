import { Marp } from 'npm:@marp-team/marp-core'

import { Codejar } from "jsr:@pomdtr/smallweb-codejar@0.6.1"

const codejar = new Codejar({
  fsRoot: "./data",
  urlRoot: "/edit"
})

export default {
  fetch(req: Request) {
    const url = new URL(req.url)
    if (url.pathname == "/edit" || url.pathname.startsWith('/edit/')) {
      return codejar.fetch(req)
    }

    const marp = new Marp()

    const markdown = Deno.readTextFileSync('data/slides.md')
    const { html, css } = marp.render(markdown)

    return new Response(/* html */ `<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Marp</title>
  <link rel="icon" href="https://marp.app/favicon.png" type="image/png">
  <style>
    body {
      margin: 0;
      padding: 0;
    }
  </style>
</head>
  <body>
    <style>${css}</style>
    ${html}
  </body>
</html>
`, {
      headers: {
        'Content-Type': 'text/html'
      }
    })
  }
}
