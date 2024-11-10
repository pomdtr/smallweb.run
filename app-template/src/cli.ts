import { Command } from "@cliffy/command";

export type CliParams = {
    name: string;
};

export function createCli(params: CliParams) {
    return new Command().action(() => {
        console.log(`Hello ${params.name}!`);
    });
}
