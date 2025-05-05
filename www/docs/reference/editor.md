# Editor Support

## VS Code

You can get completions for the app and global config files by adding the following snippet to your user settings:

```json
{
  "json.schemas": [
    {
      "url": "https://github.com/pomdtr/smallweb/releases/latest/download/manifest.schema.json",
      "fileMatch": [
        "smallweb.json",
        "smallweb.jsonc"
      ]
    },
    {
      "url": "https://github.com/pomdtr/smallweb/releases/latest/download/config.schema.json",
      "fileMatch": [
        ".smallweb/config.json",
        ".smallweb/config.jsonc"
      ]
    }
  ]
}
```

## AI Apps

Smallweb provides both `llms.txt` and `llms-full.txt` file that you can provide to your favourite AI model.

- <https://www.smallweb.run/llms.txt>
- <https://www.smallweb.run/llms-full.txt>
