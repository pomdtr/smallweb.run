#!/bin/sh

# This script is for installing the latest version of Smallweb CLI on your machine.

# Usage: curl -sSfL https://install.smallweb.run | sh

set -e

# Terminal ANSI escape codes.
reset="\033[0m"
bright_blue="${reset}\033[34;1m"

probe_arch() {
    ARCH=$(uname -m)
    case $ARCH in
        x86_64) ARCH="x86_64"  ;;
        aarch64) ARCH="arm64" ;;
        arm64) ARCH="arm64" ;;
        *) printf "Architecture ${ARCH} is not supported by this installation script\n"; exit 1 ;;
    esac
}

probe_os() {
    OS=$(uname -s)
    case $OS in
        Darwin) OS="Darwin" ;;
        Linux) OS="Linux" ;;
        *) printf "Operating system ${OS} is not supported by this installation script\n"; exit 1 ;;
    esac
}


install_smallweb_cli() {
  URL_PREFIX="https://github.com/pomdtr/smallweb/releases/download/v{{ version }}"
  TARGET="${OS}_$ARCH"

  printf "${bright_blue}Downloading smallweb {{ version }}...${reset}\n"

  URL="$URL_PREFIX/smallweb_$TARGET.tar.gz"
  DOWNLOAD_FILE=$(mktemp -t smallweb.XXXXXXXXXX)

  if ! curl --progress-bar -L -f "$URL" -o "$DOWNLOAD_FILE"; then
    printf "Failed to download $URL. Please check the URL or your network connection.\n"
    exit 1
  fi

  printf "\n${bright_blue}Installing to ${reset}$INSTALL_DIRECTORY/smallweb\n"
  mkdir -p "$INSTALL_DIRECTORY"
  tar -C "$INSTALL_DIRECTORY" -zxf "$DOWNLOAD_FILE" smallweb
  rm -f "$DOWNLOAD_FILE"
}

# do everything in main, so that partial downloads of this file don't mess up the installation
main() {
  probe_arch
  probe_os

  INSTALL_DIRECTORY="{{ target_dir }}"
  install_smallweb_cli
  printf "\n${bright_blue}Smallweb CLI has been installed!${reset}\n"
  command -v smallweb >/dev/null 2>&1 || printf "\n${bright_blue}Please add $INSTALL_DIRECTORY to your \$PATH${reset}\n"
}

main
