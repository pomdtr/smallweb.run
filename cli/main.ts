import { Cli } from "./mod.ts";
import { lastlogin } from "jsr:@pomdtr/lastlogin"

const cli = new Cli();
cli.fetch = lastlogin(cli.fetch)

export default cli
