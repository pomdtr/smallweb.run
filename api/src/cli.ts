import * as cli from "@std/cli";

export function createCommand(
    fetchFn: (path: string, init: RequestInit) => Response | Promise<Response>,
) {
    return async (args: string[]) => {
        const { _, ...flags } = await cli.parseArgs(args, {
            string: ["_", "headers", "method", "data"],
            boolean: ["help"],
            alias: {
                help: "h",
                data: "d",
                headers: "H",
                method: "X",
            },
            collect: ["headers"],
        });

        if (flags.help) {
            console.log(`Usage: cli [options] <url>

Options:
  -X, --method <method>       Specify the HTTP method to use (GET, POST, etc.)
  -d, --data <data>           Send specified data in the request body
  -H, --headers <header>      Add a header to the request (can be used multiple times)
  -h, --help                  Display this help message

Arguments:
  <url>                       The URL to send the request to

Examples:
  cli -X POST -d "name=value" -H "Content-Type: application/json" https://example.com
  cli -X GET -H "Accept: application/json" https://example.com
`);
            return;
        }

        if (_.length === 0) {
            console.error("No path provided");
            Deno.exit(1);
        }

        const path = _[0];
        const headers = new Headers();
        for (const header of flags.headers || []) {
            const [name, value] = header.split(":");
            headers.set(name, value);
        }

        const resp = await fetchFn(path, {
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
    };
}
