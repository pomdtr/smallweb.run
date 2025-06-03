export const layout = "layouts/archive.vto";
export const title = "Archive";

export default function* ({ search, paginate }) {
  const posts = search.pages("type=post !draft=true", "date=desc");

  for (
    const data of paginate(posts, { url, size: 10 })
  ) {
    // Show the first page in the menu
    if (data.pagination.page === 1) {
      data.menu = {
        visible: true,
        order: 1,
      };
    }

    yield data;
  }
}

function url(n) {
  if (n === 1) {
    return "/archive/";
  }

  return `/archive/${n}/`;
}
