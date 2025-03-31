export type DefaultExport = {
    fetch?: (req: Request) => Response | Promise<Response>;
    run?: (args: string[], input: ReadableStream) => void | Promise<void>;
    email?: (msg: ReadableStream) => void | Promise<void>;
}

export type Config = {
    domain?: string;
    oidc?: {
        issuer: string;
    }
    additionalDomains?: string[];
    authorizedKeys?: string[];
    authorizedEmails?: string[];
    authorizedGroups?: string[];
    apps?: {
        [name: string]: {
            admin?: boolean;
            private?: boolean;
            privateRoutes?: string[];
            publicRoutes?: string[];
            crons?: {
                schedule: string;
                args: string[];
                description?: string;
            }[]
            additionalDomains?: string[];
            authorizedKeys?: string[];
            authorizedEmails?: string[];
            authorizedGroups?: string[];
        }
    }
}

export type Manifest = {
    root?: string;
    entrypoint?: string;
    labels?: Record<string, string>;
}
