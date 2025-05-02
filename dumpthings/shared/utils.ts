// Types for file dumper
export interface UploadResponse {
  url: string;
}

export interface ContentState {
  type: "text" | "image";
  value: string;
}

/**
 * Determine if content is likely text by checking for null bytes
 * Simple and reliable approach to detect binary files
 */
export function isTextContent(buffer: ArrayBuffer): boolean {
  // Convert buffer to string and check for null bytes
  const str = new TextDecoder().decode(buffer);
  return !str.includes("\0");
}
