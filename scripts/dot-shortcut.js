document.addEventListener("keydown", (event) => {
    if (event.key != ".") {
        return;
    }

    if (document.activeElement != document.body) {
        return;
    }

    const url = new URL(import.meta.url).searchParams.get("url");
    if (!url) {
        throw new Error("URL not provided");
    }

    globalThis.open(url);
});
