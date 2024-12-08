#!/usr/bin/env nu

# Edit smallweb secrets
def main [
    app?: string # The application to manage secrets for
    --global (-g) # Use the global secrets file
    --update-keys # Update the encryption keys
]: nothing -> nothing {
    if ($global) {
        sops $"($env.SMALLWEB_DIR)/.smallweb/secrets.enc.env"
    } else if ($update_keys) {
        if ($env.SMALLWEB_DIR | path join .smallweb secrets.enc.env | path exists) {
            sops updatekeys $"($env.SMALLWEB_DIR)/.smallweb/secrets.enc.env"
        }

        for dir in (ls $env.SMALLWEB_DIR) {
            let name = ($dir | get name)
            if ($name | path join  secrets.enc.env | path exists) {
                sops updatekeys $"($name)/secrets.enc.env"
            }
        }
    } else if ($app != null) {
        sops $"($env.SMALLWEB_DIR)/($app)/secrets.enc.env"
    } else if ((pwd | path dirname) == $env.SMALLWEB_DIR) {
        sops secrets.enc.env
    } else {
        print --stderr "No application specified and not in a smallweb application directory."
    }
}
