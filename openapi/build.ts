import manifest from "./deno.json" with { type: "json" }

const resp = await fetch(`https://raw.githubusercontent.com/pomdtr/smallweb/refs/tags/v${manifest.version}/api/openapi.json`)
if (!resp.ok) {
    throw new Error("Failed to fetch API manifest")
}

const specs = await resp.json()

await Deno.writeTextFile("openapi.json", JSON.stringify(specs, null, 2))

const content = `export default ${JSON.stringify(specs, null, 2)} as const;\n`
await Deno.writeTextFile("mod.ts", content)
