export type Context = {
    domain: string;
    dir: string;
    app: {
        dir: string;
        name: string;
        url: string;
    };
};

export function getContext(): Context {
    const {
        SMALLWEB_DOMAIN,
        SMALLWEB_DIR,
        SMALLWEB_APP_DIR,
        SMALLWEB_APP_NAME,
        SMALLWEB_APP_URL,
    } = Deno.env.toObject();

    return {
        domain: SMALLWEB_DOMAIN,
        dir: SMALLWEB_DIR,
        app: {
            dir: SMALLWEB_APP_DIR,
            name: SMALLWEB_APP_NAME,
            url: SMALLWEB_APP_URL,
        },
    };
}
