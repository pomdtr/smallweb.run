import { serveFile } from "https://esm.town/v/std/utils@85-main/index.ts";
import { Hono } from "npm:hono";
import { blob } from "https://esm.town/v/std/blob?v=13";
import { getContentTypeHeaders } from "../shared/mimetype.ts";
import api from "./api.ts";

const app = new Hono();

// Serve index.html at the root /
app.get("/", async c => {
  return serveFile("/frontend/index.html", import.meta.url);
});

// Serve all /frontend files
app.get("/frontend/**/*", c => serveFile(c.req.path, import.meta.url));

// Serve shared files
app.get("/shared/**/*", c => serveFile(c.req.path, import.meta.url));

// Mount the API router
app.route("/api", api);

// Serve blob files using query parameter
app.get("/blob", async c => {
  const key = c.req.query("key");
  
  if (!key) {
    return c.text("Missing key parameter", 400);
  }
  
  try {
    // Get the blob using the key from query parameter
    const fileData = await blob.get(key);
    if (!fileData) return c.text("File not found", 404);
    
    console.log(`Serving file: ${key}`);
    
    // Get content type headers with special handling for video files
    const headers = getContentTypeHeaders(key);
    
    return new Response(fileData.body, { headers });
  } catch (error) {
    console.error("Error retrieving file:", error);
    return c.text("Error retrieving file", 500);
  }
});

// Unwrap and rethrow Hono errors as the original error
// If you delete this, all errors will be "Internal Server Error"
app.onError((err, c) => {
  throw err;
});

// HTTP vals expect an exported "fetch handler"
// This is how you "run the server" in Val Town with Hono
export default app.fetch;