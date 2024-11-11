import { html } from "hono/html";

export default html`
<!-- Copyright (C) Microsoft Corporation. All rights reserved. -->
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />

    <!-- Mobile tweaks -->
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-title" content="Code" />
    <link rel="apple-touch-icon" href="/code-192.png" />

    <!-- Disable pinch zooming -->
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />

    <!-- Workbench Icon/Manifest/CSS -->
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    <link data-name="vs/workbench/workbench.web.main" rel="stylesheet"
        href="https://raw.esm.sh/vscode-web@1.91.1/dist/out/vs/workbench/workbench.web.main.css" />
</head>

<body aria-label=""></body>

<!-- Startup (do not modify order of script tags!) -->
<script src="https://raw.esm.sh/vscode-web@1.91.1/dist/out/vs/loader.js"></script>
<script src="https://raw.esm.sh/vscode-web@1.91.1/dist/out/vs/webPackagePaths.js"></script>
<script>
    Object.keys(self.webPackagePaths).map(function (key, index) {
        self.webPackagePaths[
            key
        ] = "https://raw.esm.sh/vscode-web@1.91.1/dist/node_modules/" + key + self.webPackagePaths[key];
    });
    require.config({
        baseUrl: "https://raw.esm.sh/vscode-web@1.91.1/dist/out",
        recordStats: true,
        trustedTypesPolicy: window.trustedTypes?.createPolicy('amdLoader', {
            createScriptURL(value) {
                return value;
            },
        }),
        paths: self.webPackagePaths,
    });
</script>
<script src="https://raw.esm.sh/vscode-web@1.91.1/dist/out/vs/workbench/workbench.web.main.nls.js"></script>
<script src="https://raw.esm.sh/vscode-web@1.91.1/dist/out/vs/workbench/workbench.web.main.js"></script>
<script src="https://raw.esm.sh/vscode-web@1.91.1/dist/out/vs/code/browser/workbench/workbench.js"></script>

</html>
`;
