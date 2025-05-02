/**
 * Reads data from stdin into a Uint8Array buffer
 * Accumulates chunks until EOF and concatenates into single buffer
 * Exits with error if no input received or read fails

 * @returns Promise resolving to complete buffer of stdin data
 */
export async function toBuffer(): Promise<Uint8Array> {
  try {
    const buf = new Uint8Array(1024);
    const chunks = [];
    let totalLength = 0;
    Deno.stdin.readable

    while (true) {
      const n = await Deno.stdin.read(buf);
      if (n === null) break;

      const chunk = buf.subarray(0, n);
      chunks.push(chunk);
      totalLength += n;
    }

    const buffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      buffer.set(chunk, offset);
      offset += chunk.length;
    }

    if (!buffer || buffer.length === 0) {
      console.error("Error: No input received. Pipe content to this script.");
      Deno.exit(1);
    }

    return buffer;
  } catch (e) {
    if (e instanceof Error) {
      console.error("Error reading from stdin:", e.message);
      Deno.exit(1);
    }
    throw e;
  }
}
