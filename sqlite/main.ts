import { ValTown } from "npm:@valtown/sdk";

const vt = new ValTown();

export default {
    run: async () => {
        const res = await vt.sqlite.execute({
            statement: "SELECT * FROM sqlite_master;",
        });

        console.log(res);
    },
};
