export default {
  fetch: (req) => {
    const url = new URL(req.url);
    if (url.pathname == "/edit") {
      return Response.redirect("https://editor.smallweb.run/todo/README.md", 302);
    }

    return Response.redirect("https://readme.smallweb.run/todo")
  }
} satisfies Deno.ServeDefaultExport;
