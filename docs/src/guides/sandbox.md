# App Sandbox

Smallweb apps have access to:

- read access to their app folder, and the deno cache folder.
- write access to the `data` subfolder in app folder
- access to the network, to make HTTP requests.
- access to the env files defined in the `.env` files from the smallweb root folder and the app folder.

This sandbox protects the host system from malicious code, and ensures that apps can only access the resources they need.

## Sharing files between apps

To share files between your apps, just use symbolic links!

For example, if you have two apps `app1` and `app2`, and you want `app2` to access the `users.json` file from `app1`, you can create a symbolic link in the `app2` folder:

```sh
ln -s app1/data/users.json ../app2/data/users.json
```

You should only use relative paths when creating symbolic links, as the absolute path will not be synced between servers by [mutagen](https://mutagen.io/).
