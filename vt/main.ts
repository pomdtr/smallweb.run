import { vt } from "jsr:@pomdtr/vt@1.11.0";

export default {
    run: (args: string[]) => vt.parse(args),
};
