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
