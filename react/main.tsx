/** @jsxImportSource https://esm.sh/react@19.0.0 */

import { renderToString } from "https://esm.sh/react-dom@19.0.0/server";

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
