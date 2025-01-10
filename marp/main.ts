import { Marp } from 'npm:@marp-team/marp-core@4.0.1'

export default {
  fetch() {
    const marp = new Marp()
    const markdown = Deno.readTextFileSync('./data/slides.md')
    const { html, css } = marp.render(markdown)
    const body = /* html */ `<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Marp Example</title>
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
`

    return new Response(body, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  }
}
