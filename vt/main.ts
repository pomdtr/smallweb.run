import { vt } from "jsr:@pomdtr/vt@1.11.1";

export default {
    run: (args: string[]) => {
        vt.parse(args);
    }
};
