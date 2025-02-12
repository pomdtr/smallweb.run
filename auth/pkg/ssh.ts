import * as fs from "@std/fs";
import * as ssh from "ssh2";

export async function checkAuthorizedKeys(
  authorizedKeysPaths: string[],
  publicKeys: string[],
) {
  for (const authorizedKeysPath of authorizedKeysPaths) {
    if (!await fs.exists(authorizedKeysPath)) {
      continue;
    }

    if (await checkPublicKeys(authorizedKeysPath, publicKeys)) {
      return true;
    }
  }

  return false;
}

export async function checkPublicKeys(
  authorizedKeysPath: string,
  publicKeys: string[],
) {
  const parsedKeys = publicKeys.map((key) => ssh.utils.parseKey(key));
  const authorizedKeys = await Deno.readTextFile(authorizedKeysPath);

  for (const line of authorizedKeys.split("\n")) {
    if (!line) continue;
    if (line.startsWith("#")) continue;

    const authorizedKey = ssh.utils.parseKey(line);
    if (authorizedKey instanceof Error) {
      console.error(authorizedKey);
      continue;
    }

    for (const publicKey of parsedKeys) {
      if (publicKey instanceof Error) {
        console.error(authorizedKey);
        continue;
      }

      if (authorizedKey.getPublicPEM() === publicKey.getPublicPEM()) {
        return true;
      }
    }
  }

  return false;
}
