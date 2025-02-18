import { githubAuth } from "jsr:@pomdtr/github-auth@0.4.1";

export default {
    fetch: githubAuth({
        issuer: "https://auth.smallweb.run",
        authorizedUsers: ["cablehead", "pomdtr"],
    }, (req) => {
        return new Response(
            `You email is: ${req.headers.get("remote-email")}`,
        );
    }),
    run: () => {
        console.log("Hello from the run function, blablabla!");
    },
};
