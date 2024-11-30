#!/usr/bin/env nu

# Edit smallweb secrets
def main [
    app?: string # The application to manage secrets for
    --global (-g) # Use the global secrets file
]: nothing -> nothing {
    if ($global) {
        sops $"($env.SMALLWEB_DIR)/.smallweb/secrets.enc.env"
    } else if ($app != null) {
        sops $"($env.SMALLWEB_DIR)/($app)/secrets.enc.env"
    } else if ((pwd | path dirname) == $env.SMALLWEB_DIR) {
        sops secrets.enc.env
    } else {
        echo "No application specified and not in a smallweb application directory."
    }
}
