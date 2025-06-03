export type CommandParams = {
    short?: string;
    long?: string;
    subcommands?: Command[];
    options?: Record<string, CommandFlag>;
}

export type CommandFlag = {
    type?: string;
    shorthand?: string;
    description?: string;
    required?: boolean;
}

export class CommandContext {
    constructor(public args: string[]) { }

    flag = (name: string) => { }

    arg = (name: string) => { }

    help = () => { }
}

export type Action = (ctx: CommandContext) => void | Promise<void>

export class Command {
    constructor(arg1: string, arg2?: CommandParams | Action, arg3?: Action) {
    }

    async run(args: string[]) {
    }

    async subcommand(arg1: string | Command, arg2?: CommandParams, arg3?: Action) {
    }
}
