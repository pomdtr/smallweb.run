# File Dump Thing

Easily share files and text snippets by pasting or uploading them.
Built with React & Hono.

- Paste text or images directly into the app
- Upload files through the file input
- Get shareable links instantly
- Links are automatically copied to your clipboard
- Preview images and text content
- CLI tool for uploading files directly from your terminal
- Smart content detection (automatically detects text vs binary)

## How It Works

1. The app uses Val Town's blob storage to store uploaded files and text
2. When you paste or upload content, it's sent to the server and stored
3. A unique URL is generated that can be shared with others
4. The content can be accessed directly through the generated URL
5. Smart detection determines if content is text or binary

## CLI Installation & Usage

There's also a companion CLI tool!

Install the CLI tool globally:

```bash
deno install -grAf -n=fdt https://esm.town/v/wolf/FileDumpThing/cli/upload.ts
```

Then use it to quickly upload files:

```bash
# Upload a file and get a shareable URL
cat path/to/file.jpg | fdt file.jpg

# Upload text from clipboard
pbpaste | fdt notes.txt
```

See the [CLI README](/cli/README.md) for more details and examples.

## Technical Details

- **Frontend**: React components for the user interface
  - `components/FileDumper.tsx`: Main component for the file dumper interface
  - `components/App.tsx`: Root component that renders the FileDumper
  - `index.tsx`: Entry point for the React application
  - `index.html`: HTML template

- **Backend**: Hono server for handling API requests
  - `index.ts`: API routes for file uploads and serving stored content
  - `api.ts`: API endpoints for file uploads

- **Shared**: Code shared between frontend and backend
  - `utils.ts`: Shared types and utility functions
  - `mimetype.ts`: MIME type detection for various file formats

- **CLI**: Command-line interface for file uploads
  - `upload.ts`: Deno script for uploading content via stdin


- Uses Val Town's blob storage for file persistence
- Built with TypeScript for type safety
- React for the frontend UI
- Hono for the backend API
- Supports various file types with appropriate MIME type detection
- Smart content detection (checks for null bytes and UTF-8 validity)
- CLI tool for terminal-based uploads