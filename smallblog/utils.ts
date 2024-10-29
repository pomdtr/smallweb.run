import { expandGlob } from "@std/fs";

export async function isDirectoryEmpty(dirPath: string): Promise<boolean> {
    for await (const _ of expandGlob(`${dirPath}/*`)) {
        return false;
    }
    return true;
}
