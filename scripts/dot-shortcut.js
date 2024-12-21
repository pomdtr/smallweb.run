document.addEventListener("keydown", (event) => {
    if (event.key != ".") {
        return;
    }

    if (document.activeElement != document.body) {
        return;
    }

    const script = document.currentScript;
    const url = script.getAttribute("data-url");
    if (!url) {
        throw new Error("URL not provided");
    }

    globalThis.open(url);
});
