// ex. scripts/build_npm.ts
import { build, emptyDir } from "jsr:@deno/dnt";
import { copySync } from "jsr:@std/fs"
import manifest from "./deno.json" with { type: "json" };

await emptyDir("../npm");

await build({
    entryPoints: ["./pkg/mod.ts"],
    outDir: "../npm",
    shims: {
        // see JS docs for overview and more options
        deno: true,
    },
    scriptModule: false,
    importMap: "./deno.json",
    package: {
        // package.json properties
        name: manifest.name,
        version: manifest.version,
        description: "Excalidraw integration for smallweb",
        license: "MIT",
    },
    postBuild() {
        // steps to run after building and before running the tests
        Deno.copyFileSync("LICENSE", "../npm/LICENSE");
        Deno.copyFileSync("README.md", "../npm/README.md");
        copySync("pkg/static", "../npm/esm/static");
    },
});
