# Symlinks

Symbolic links have multiple uses in smallweb.

## Sharing files between apps

In smallweb, apps can only access files in their own directory. However, you can use symlinks to share files between apps.

If you to access the `users.json` file from `app1` in `app2`, you can create a symbolic link in the `app2` folder:

```sh
smallweb link app1/users.json app2/users.json
```

You can also use this mechanism to share directories between apps.

## Map multiple subomains to the same app

In smallweb, subdomains are mapped to directories. If you want to map multiple subdomains to the same app, you just need multiple subdirectories with symlinks to the main app directory.

```sh
# Make gh.<domain> point to the github app
smallweb link github gh
```

Of course, you can also use the `customDomains` field in the global config file to achieve the same result, but using symlinks make them visible from the filesystem.
