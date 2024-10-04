import { vt } from "jsr:@pomdtr/vt@1.10.13";

export default {
    run: (args: string[]) => vt.parse(args),
};
