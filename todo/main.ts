export default {
  fetch: (req) => {
    const url = new URL(req.url);
    if (url.pathname == "/edit") {
      return Response.redirect("https://editor.smallweb.run/todo/TODO.md", 302);
    }

    return fetch("https://readme.smallweb.run/todo/TODO.md")
  }
} satisfies Deno.ServeDefaultExport;
