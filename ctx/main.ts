import { getContext } from "./mod.ts";

const ctx = getContext();

export default {
    fetch: () => Response.json(ctx),
};
