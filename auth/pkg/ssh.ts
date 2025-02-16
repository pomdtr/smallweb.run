import * as ssh from "ssh2";

export function checkPublicKeys(
  authorizedKeys: string[],
  publicKeys: string[],
) {
  const parsedKeys = publicKeys.map((key) => ssh.utils.parseKey(key));

  for (const authorizedKeyText of authorizedKeys) {
    const authorizedKey = ssh.utils.parseKey(authorizedKeyText);
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
