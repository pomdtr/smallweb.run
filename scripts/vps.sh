#!/bin/sh
# usage: curl -fsSL https://scripts.smallweb.run/vps.sh | sh -s -- <domain>

set -e

SMALLWEB_DOMAIN=$1
if [ -z "$SMALLWEB_DOMAIN" ]; then
    printf "🚨 Usage: curl -fsSL https://scripts.smallweb.run/vps.sh | sh -s -- <domain>\n"
    exit 1
fi

printf "\n🔧 Installing required packages...\n\n"

if [ -f /etc/debian_version ]; then
    apt update -qq && apt install -y -qq curl unzip
elif [ -f /etc/redhat-release ]; then
    yum update -q && yum install -y -q curl unzip
elif [ -f /etc/arch-release ]; then
    pacman -Syu --noconfirm --quiet curl unzip
else
    printf "❌ Unsupported distribution\n"
    exit 1
fi

printf "\n✅ Required packages installed successfully!\n"
sleep 2

printf "\n📦 Installing Deno...\n\n"

curl -fsSL https://deno.land/install.sh | sh -s -- --yes --no-modify-path
printf "\n✅  Deno installed successfully!\n\n"
sleep 2

printf "\n⬇️ Installing smallweb...\n\n"
sleep 2
curl -fsSL 'https://install.smallweb.run?v=0.19.0-rc.4&target_dir=/usr/local/bin' | sh

printf "\n🔧 Creating default smallweb directory...\n"

SMALLWEB_DIR="$HOME/smallweb"
mkdir -p "$SMALLWEB_DIR/.smallweb"
cat <<EOF > "$SMALLWEB_DIR/.smallweb/config.json"
{
    "domain": "$SMALLWEB_DOMAIN",
    "adminApps": [
        "vscode"
    ]
}
EOF

VSCODE_PASSWORD=$(head -c 16 /dev/urandom | base64 | tr -d '\n')

mkdir -p "$SMALLWEB_DIR/www"
cat <<EOF > "$SMALLWEB_DIR/www/index.md"
# Welcome to Smallweb!

This is a simple markdown file served by Smallweb.

EOF

mkdir -p "$SMALLWEB_DIR/vscode"
cat <<EOF > "$SMALLWEB_DIR/vscode/main.ts"
import { VSCode } from "jsr:@smallweb/vscode@0.1.7"

const vscode = new VSCode({
    rootDir: Deno.env.get("SMALLWEB_DIR")
});

export default vscode;
EOF

cat <<EOF > "$SMALLWEB_DIR/vscode/.env"
VSCODE_PASSWORD=$VSCODE_PASSWORD
EOF

mkdir -p "$SMALLWEB_DIR/smallblog"
cat <<EOF > "$SMALLWEB_DIR/smallblog/main.ts"
import { Smallblog } from "jsr:@tayzendev/smallblog@1.2.0"

const smallblog = new Smallblog()

export default smallblog
EOF

smallweb --dir "$SMALLWEB_DIR" service install -- --on-demand-tls

printf "\n✅ Smallweb installed successfully!\n\n"
sleep 2

IPV4=$(curl -s https://api.ipify.org)
IPV6=$(curl -s https://api6.ipify.org)

cat <<EOF
🎉 Smallweb is now installed and running!

🌐 Now set your domain's A and AAAA records to your server's IP addresses:

A Record: $SMALLWEB_DOMAIN -> $IPV4
AAAA Record: $SMALLWEB_DOMAIN -> $IPV6
A Record: *.$SMALLWEB_DOMAIN -> $IPV4
AAAA Record: *.$SMALLWEB_DOMAIN -> $IPV6

Once you've set your domain's DNS records, visit https://$SMALLWEB_DOMAIN in your browser to see your first smallweb site.

An editor is available at https://vscode.$SMALLWEB_DOMAIN. Once you access it, you will be prompted for a password.

The password is: $VSCODE_PASSWORD

EOF
