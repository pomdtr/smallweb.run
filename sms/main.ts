import * as contiguity from "npm:@contiguity/javascript";

const token = Deno.env.get("CONTIGUITY_TOKEN");
if (!token) {
    throw new Error("contiguity token is required");
}
const client = contiguity.login(token);

const phone = Deno.env.get("PHONE_NUMBER");
if (!phone) {
    throw new Error("phone number is required");
}
if (!client.verify.number(phone)) {
    throw new Error("invalid phone number");
}

export default {
    run: async (args: string[]) => {
        if (!args) {
            throw new Error("text is required");
        }

        const res = await client.send.text({
            to: phone,
            message: args.join(" "),
        });

        console.log(res);
    },
};
