export type App = {
    fetch?: (req: Request) => Response | Promise<Response>;
    run?: (args: string[]) => void | Promise<void>;
}
