import { ValTown } from "@valtown/sdk";

export default {
    run: (args: string[]) => {
        const valtown = new ValTown();
        valtown.emails.send({
            text: args.join(" "),
        });
    },
};
