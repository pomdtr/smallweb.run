import handleRequest from "./backend/index.ts"
import handleCommand from "./cli/upload.ts"


export default {
    fetch: handleRequest,
    run: handleCommand,
}
