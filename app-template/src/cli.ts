import { Command } from "@cliffy/command";

export function createCli(params: {
    name: string;
}) {
    return new Command().action(() => {
        console.log(`Hello ${params.name}!`);
    });
}
