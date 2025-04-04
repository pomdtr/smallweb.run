async function handleRequest() {
    const { SMALLWEB_DOMAIN, SMALLWEB_DIR } = Deno.env.toObject();
    let entries = await Array.fromAsync(Deno.readDir(SMALLWEB_DIR))
    entries = entries.filter(entry => !entry.name.startsWith("."))
    const html = /* html */`<!DOCTYPE html>
<html>
<head>
    <title>Smallweb</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>URL</th>
            </tr>
        </thead>
        <tbody>
            ${entries.map(entry => `
                <tr>
                    <td>${entry.name}</td>
                    <td><a href="https://${entry.name}.${SMALLWEB_DOMAIN}">https://${entry.name}.${SMALLWEB_DOMAIN}</a></td>
                </tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>`;
    return new Response(html, {
        headers: {
            "content-type": "text/html"
        }
    });
}

export default {
    fetch: handleRequest
}
