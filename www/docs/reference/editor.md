# Editor Support

## VS Code

You can get completions for the app and global config files by adding the following snippet to your user settings:

```json
{
  "json.schemas": [
    {
      "fileMatch": ["smallweb.json"],
      "url": "https://smallweb.dev/schemas/smallweb.json"
    },
    {
      "fileMatch": [".smallweb.json"],
      "url": "https://smallweb.dev/schemas/global.json"
    }
  ]
}
```
