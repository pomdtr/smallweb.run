export default {
  fetch: (req: Request) => {
    const url = new URL(req.url);
    if (url.pathname === "/edit") {
      return Response.redirect("https://editor.smallweb.run/readme/todo.md");
    }

    return Response.redirect("https://readme.smallweb.run/todo.md");
  },
};
