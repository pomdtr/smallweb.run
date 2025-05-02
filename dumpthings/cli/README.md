# File Dumper CLI

A simple CLI tool for uploading files to the File Dumper service.

## Installation

You can install the CLI tool globally using Deno:

```bash
deno install -grAf -n=fdt https://esm.town/v/wolf/FileDumpThing/cli/upload.ts
```

This command:
- Installs the tool globally (`-g`)
- Reloads all dependencies to ensure the latest version (`-r`)
- Grants all necessary permissions (`-A`)
- Forces overwrite of any existing installation (`-f`)
- Names the command `fdt` (`-n=fdt`)

After installation, you can use the tool with the `fdt` command:

```bash
cat image.png | fdt image.png
```

## Usage

```bash
# Upload a file
cat path/to/file.jpg | fdt file.jpg

# Upload text
echo "Hello World" | fdt note.txt

# Or use the full Deno command if not installed
cat path/to/file.jpg | deno run --allow-net https://esm.town/v/wolf/FileDumpThing/cli/upload.ts file.jpg
```

The filename argument is optional but helps identify the file in the URL.

## Smart Content Detection

The CLI automatically detects whether the input is text or binary:

- Text content is uploaded as plain text (with .txt extension)
- Binary content is uploaded as a file (with .bin extension if no extension is provided)

This detection happens by checking for null bytes in the content.

## Examples

```bash
# Upload and open in browser
cat image.png | fdt image.png | xargs open

# Upload and copy URL to clipboard (macOS)
cat document.pdf | fdt document.pdf | pbcopy

# Upload text from clipboard (macOS)
pbpaste | fdt notes.txt
```

## Alternative: Shell Alias

If you prefer not to install, you can create a shell alias:

```bash
# Add to your .bashrc, .zshrc, etc.
alias fdt='deno run --allow-net https://esm.town/v/wolf/FileDumpThing/cli/upload.ts'
```

Then use:

```bash
cat image.png | fdt image.png
```

## How It Works

The CLI tool:
1. Reads content from stdin
2. Automatically detects if it's text or binary
3. Uploads it to the API at `filedumpthing.val.run`
4. Returns a shareable URL