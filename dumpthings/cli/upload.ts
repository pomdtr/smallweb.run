#!/usr/bin/env -S deno run -A
import { isTextContent } from "../shared/utils.ts";
import { toArrayBuffer } from "jsr:@std/streams"

const API_URL = `https://filedumpthing.val.run/api/upload`;

export default async function (_args: string[], input: ReadableStream) {
  try {
    // Get filename from args or use a temporary name (will be replaced with appropriate extension)
    const filename = Deno.args[0] || `file_${Date.now()}`;
    const buffer = await toArrayBuffer(input)

    // Magic detection: Check if content is text or binary
    const isText = isTextContent(buffer);

    // Create a FormData object (same as the web interface)
    const formData = new FormData();

    if (isText) {
      // Handle as text content
      const textContent = new TextDecoder().decode(buffer);
      formData.append("type", "text");
      formData.append("content", textContent);

      // If no filename was provided, use a text-specific default
      if (!Deno.args[0]) {
        const timestamp = Date.now();
        formData.append("filename", `text_${timestamp}.txt`);
      } else {
        formData.append("filename", filename);
      }
    } else {
      // Handle as binary/file content
      formData.append("type", "file");

      // Create a File object from the buffer
      const file = new File([buffer], filename, {
        type: "application/octet-stream",
      });

      formData.append("file", file);

      // Make sure we use the original filename or a binary-specific default
      if (!Deno.args[0]) {
        const timestamp = Date.now();
        formData.append("filename", `file_${timestamp}.bin`); // Add .bin extension for binary files
      } else {
        formData.append("filename", filename);
      }
    }

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error: Server returned ${response.status}`, errorText);
      Deno.exit(1);
    }

    const data = await response.json();
    await Deno.stdout.write(new TextEncoder().encode(data.url)); // Prints without a newline
  } catch (e) {
    if (e instanceof Error) {
      console.error("Error:", e.message);
      Deno.exit(1);
    }
  }
}
