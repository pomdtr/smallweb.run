document.addEventListener("keydown", (event) => {
    if (event.key != ".") {
        return;
    }

    if (document.activeElement != document.body) {
        return;
    }

    const url: string | null = new URL(import.meta.url).searchParams.get("url");
    if (!url) {
        console.error("No URL found in query string");
        return;
    }

    globalThis.open(url);
});
