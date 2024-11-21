/** @jsxImportSource https://esm.sh/react */

import { renderToString } from "npm:react-dom/server";

function MyApp() {
    return (
        <div>
            <h1>Welcome to my app</h1>
        </div>
    );
}

export default {
    fetch() {
        return new Response(renderToString(<MyApp />), {
            headers: {
                "Content-Type": "text/html",
            },
        });
    }
}
