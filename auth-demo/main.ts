import { githubAuth } from "jsr:@pomdtr/github-auth@0.4.3";

export default {
    fetch: githubAuth({
        issuer: "https://auth.smallweb.run",
        authorizedUsers: ["pomdtr"],
    }, (req) => {
        return new Response(
            `You email is blablabla: ${req.headers.get("remote-email")}`,
        );
    }),
    run: () => {
        console.log("Hello from the run function, blablabla!");
    },
};
