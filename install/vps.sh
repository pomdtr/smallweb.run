#!/bin/sh
# usage: curl -fsSL https://install.smallweb.run/vps.sh | sh

set -e

if [ "$(id -u)" -ne 0 ]; then
    printf "❌ This script must be run as root\n"
    exit 1
fi

printf "\n🔧 Installing required packages...\n\n"

if [ -f /etc/debian_version ]; then
    apt update -qq && apt install -y -qq unzip
elif [ -f /etc/redhat-release ]; then
    yum update -q && yum install -y -q unzip
elif [ -f /etc/arch-release ]; then
    pacman -Syu --noconfirm --quiet unzip
else
    printf "❌ Unsupported distribution\n"
    exit 1
fi

printf "\n✅ Required packages installed successfully!\n"
sleep 2

useradd --system --user-group --create-home --shell "$(which bash)" smallweb

# move the authorized_keys file to the smallweb user
if [ -f /root/.ssh/authorized_keys ]; then
    mkdir -p /home/smallweb/.ssh
    cp /root/.ssh/authorized_keys /home/smallweb/.ssh/authorized_keys
    chown -R smallweb:smallweb /home/smallweb/.ssh
fi

printf "\n📦 Installing Deno...\n\n"

su smallweb -c 'curl -fsSL https://deno.land/install.sh | sh -s -- --yes'
printf "\n✅  Deno installed successfully!\n"
sleep 2

printf "\n⬇️ Installing smallweb...\n\n"
sleep 2
curl -fsSL 'https://install.smallweb.run' | sh

printf "\n🔧 Creating default smallweb directory...\n\n"

IPV4=$(curl -s https://api.ipify.org)
SMALLWEB_DOMAIN=$(printf "%s" "$IPV4" | tr '.' '-').sslip.io
SMALLWEB_DIR="/home/smallweb/smallweb"

# shellcheck disable=SC2016
su smallweb -c "smallweb --dir $SMALLWEB_DIR init $SMALLWEB_DOMAIN"

cat <<EOF > /etc/systemd/system/smallweb.service
[Unit]
Description=Smallweb Service
After=network.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/local/bin/smallweb up --cron --on-demand-tls
AmbientCapabilities=CAP_NET_BIND_SERVICE
User=smallweb
Restart=always
RestartSec=10
WorkingDirectory=/home/smallweb
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=smallweb

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable smallweb
systemctl start smallweb

cat <<EOF

🌐 Visit https://$SMALLWEB_DOMAIN in your browser to see your first smallweb site.

An editor is available at https://vscode.$SMALLWEB_DOMAIN. Once you access it, you will be prompted for a password.

The password can be found in the following file: $SMALLWEB_DIR/vscode/.env

EOF
