// ==UserScript==
// @name         Open in VS Code
// @namespace    Smallweb
// @match        https://*.smallweb.run/*
// @match        https://*.pomdtr.me/*
// @match        https://*.pomdtr.smallweb.live/*
// @version      1.0
// @description  Edit Current Website in VS Code
// @author       pomdtr
// @grant        GM_registerMenuCommand
// ==/UserScript==

GM_registerMenuCommand("Open in VS Code", () => {
    const domain = globalThis.location.hostname;
    const vscodeUrl = `vscode://pomdtr.smallweb/openApp?domain=${domain}`;
    globalThis.location.href = vscodeUrl;
});

