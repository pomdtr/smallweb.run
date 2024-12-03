document.addEventListener("keydown", (event) => {
    if (event.key != ".") {
        return;
    }

    if (document.activeElement != document.body) {
        return;
    }

    const url: string | null = new URL(import.meta.url).searchParams.get("url");
    if (!url) {
        const app = globalThis.location.hostname.replace(/.smallweb.run$/, "");
        globalThis.open(`https://vscode.smallweb.run/${app}`);
        return;
    }

    globalThis.open(url);
});
