// Mime type mapping for file extensions
export const mimeTypes: Record<string, string> = {
  // Image formats
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'gif': 'image/gif',
  'webp': 'image/webp',
  'svg': 'image/svg+xml',
  'bmp': 'image/bmp',
  'ico': 'image/x-icon',
  // Text formats
  'txt': 'text/plain',
  // Video formats
  'mp4': 'video/mp4',
  'webm': 'video/webm',
  'mov': 'video/quicktime',
  'avi': 'video/x-msvideo',
  'mkv': 'video/x-matroska',
  'm4v': 'video/mp4'
};

// Helper to get mime type from filename
export function getMimeType(fileName: string): string {
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
  return mimeTypes[fileExtension] || 'application/octet-stream';
}

// Get MIME type with special handling for video files
export function getContentTypeHeaders(key: string): Record<string, string> {
  const fileExtension = key.split('.').pop()?.toLowerCase() || '';
  const mimeType = getMimeType(key);
  
  const headers: Record<string, string> = {
    "Content-Type": mimeType,
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff"
  };
  
  // For video files, explicitly set the correct MIME type
  if (fileExtension === 'mp4' || fileExtension === 'm4v') {
    headers["Content-Type"] = "video/mp4";
  } else if (fileExtension === 'webm') {
    headers["Content-Type"] = "video/webm";
  }
  
  return headers;
}