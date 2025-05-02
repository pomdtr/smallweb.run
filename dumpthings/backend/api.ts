import { blob } from "https://esm.town/v/std/blob?v=13";
import { Hono } from "npm:hono";
import { isTextContent } from "../shared/utils.ts";

// Create a router for /api routes
const api = new Hono();

// Unified upload endpoint with magic detection
api.post("/upload", async c => {
  try {
    const formData = await c.req.formData();
    const uploadType = formData.get("type") as string;

    if (uploadType === "text") {
      const content = formData.get("content") as string;
      const key = `blob_text_${Date.now()}.txt`;

      try {
        await blob.set(key, new TextEncoder().encode(content));
        const responseUrl = `${new URL(c.req.url).origin}/blob?key=${encodeURIComponent(key)}`;
        return c.json({ url: responseUrl });
      } catch (error) {
        console.error("Failed to store text:", error);
        return c.json({ error: "Failed to store text" }, 500);
      }
    }

    if (uploadType === "file") {
      const file = formData.get("file") as File;
      const originalFilename = formData.get("filename") as string || `file_${Date.now()}`;

      if (!file) return c.json({ error: "No file uploaded" }, 400);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      // Use magic detection to determine if this is actually text content
      const isText = isTextContent(buffer);

      if (isText) {
        // If it's text, store it as text
        const textContent = new TextDecoder().decode(buffer);
        const key = `blob_text_${Date.now()}_${originalFilename}`;

        await blob.set(key, new TextEncoder().encode(textContent));
        const responseUrl = `${new URL(c.req.url).origin}/blob?key=${encodeURIComponent(key)}`;
        return c.json({ url: responseUrl });
      } else {
        // Otherwise, store it as binary
        const key = `blob_file_${Date.now()}_${originalFilename}`;

        await blob.set(key, buffer);
        const responseUrl = `${new URL(c.req.url).origin}/blob?key=${encodeURIComponent(key)}`;
        return c.json({ url: responseUrl });
      }
    }

    return c.json({ error: "Invalid upload type" }, 400);
  } catch (error) {
    console.error("Failed to parse form data:", error);
    return c.json({ error: "Failed to process upload" }, 500);
  }
});

export default api;