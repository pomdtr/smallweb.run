# Editor Support

## VS Code

You can get completions for the app and global config files by adding the following snippet to your user settings:

```json
{
  "json.schemas": [
    {
      "fileMatch": ["smallweb.json"],
      "url": "https://schemas.smallweb.run/manifest"
    },
    {
      "fileMatch": [".smallweb/config.json"],
      "url": "https://schemas.smallweb.run/config"
    }
  ]
}
```

## AI Apps

Smallweb provides both `llms.txt` and `llms-full.txt` file that you can provide to your favourite AI model.

- <https://www.smallweb.run/llms.txt>
- <https://www.smallweb.run/llms-full.txt>
