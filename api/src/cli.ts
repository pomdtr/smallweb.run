import { Command } from "@cliffy/command";

export function createCommand(
    params: {
        name: string;
        fetchApi: (
            path: string,
            init: RequestInit,
        ) => Response | Promise<Response>;
    },
) {
    return new Command().name(params.name).arguments(
        "<pathname:string>",
    ).option(
        "-X, --method <method:string>",
        "Specify the HTTP method to use (GET, POST, etc.)",
    ).option(
        "-d, --data <data:string>",
        "Send specified data in the request body",
    ).option(
        "-H, --header <header:string>",
        "Add a header to the request (can be used multiple times)",
        { collect: true },
    ).action(async (flags, pathname) => {
        const headers = new Headers();
        for (const header of flags.header || []) {
            const [name, value] = header.split(":");
            headers.set(name, value);
        }

        const resp = await params.fetchApi(pathname, {
            method: flags.method,
            body: flags.data,
            headers,
        });

        if (resp.headers.get("content-type")?.includes("application/json")) {
            const body = await resp.json();
            console.log(JSON.stringify(body, null, 2));
            return;
        }

        console.log(await resp.text());
    });
}
