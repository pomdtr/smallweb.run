import * as http from "@std/http"

export default {
    fetch: (req: Request) => {
        return http.serveDir(req, {
            fsRoot: "static",
        });
    },
    run: () => {
        console.log("Hello from smallweb!");
    },
};
