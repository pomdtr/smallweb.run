export type FetchFn = (req: Request) => Response | Promise<Response>;
export type RunFn = (args: string[]) => void | Promise<void>;
