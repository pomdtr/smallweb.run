import { Smallweb } from "./mod.ts"

const execPath = "/Users/pomdtr/go/bin/smallweb"

const smallweb = new Smallweb(execPath)

const resp = await smallweb.api("/openapi.json")
if (!resp.ok) {
    throw new Error(`Failed to fetch API: ${resp.statusText}`)
}
console.log(await resp.text())

