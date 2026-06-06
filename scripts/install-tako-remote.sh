#!/usr/bin/env bash
# Tako Remote CLI — one-click installer (macOS / Linux)
#
# Installs the Tako remote-control CLI. If Node.js is missing, installs a
# private copy under ~/.tako/node so the user does not need a system Node.
#
#   curl -fsSL https://tako.shiroha.tech/install.sh | bash
#
# Env overrides:
#   TAKO_CLI_PACKAGE   npm package to install (default: tako-remote)
#   TAKO_NODE_VERSION  Node version to fetch if missing (default: 22.11.0)
#   TAKO_HOME          install root (default: ~/.tako)

set -euo pipefail

TAKO_CLI_PACKAGE="${TAKO_CLI_PACKAGE:-tako-remote}"
TAKO_NODE_VERSION="${TAKO_NODE_VERSION:-22.11.0}"
TAKO_HOME="${TAKO_HOME:-$HOME/.tako}"
NODE_DIR="$TAKO_HOME/node"

log()  { printf '\033[1;36m[tako]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[tako]\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[1;31m[tako]\033[0m %s\n' "$*" >&2; exit 1; }

# Sets PLATFORM (darwin|linux) and ARCH (x64|arm64) for Node tarball naming.
detect_platform() {
    local os arch
    os="$(uname -s)"
    arch="$(uname -m)"
    case "$os" in
        Darwin) PLATFORM="darwin" ;;
        Linux)  PLATFORM="linux" ;;
        *) die "Unsupported OS: $os (this script covers macOS/Linux; on Windows use the .msi installer)" ;;
    esac
    case "$arch" in
        x86_64|amd64) ARCH="x64" ;;
        arm64|aarch64) ARCH="arm64" ;;
        *) die "Unsupported architecture: $arch" ;;
    esac
}
# True if a usable node (>=20) is already on PATH.
node_ok() {
    command -v node >/dev/null 2>&1 || return 1
    local major
    major="$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)"
    [ "$major" -ge 20 ] 2>/dev/null
}

# Download a private Node into $NODE_DIR and prepend it to PATH for this run.
install_node() {
    local base url tarball
    base="node-v${TAKO_NODE_VERSION}-${PLATFORM}-${ARCH}"
    url="https://nodejs.org/dist/v${TAKO_NODE_VERSION}/${base}.tar.gz"
    tarball="$TAKO_HOME/${base}.tar.gz"

    log "Node.js not found — installing a private copy (v${TAKO_NODE_VERSION}) under $NODE_DIR"
    mkdir -p "$TAKO_HOME"
    if command -v curl >/dev/null 2>&1; then
        curl -fsSL "$url" -o "$tarball" || die "Failed to download Node from $url"
    elif command -v wget >/dev/null 2>&1; then
        wget -qO "$tarball" "$url" || die "Failed to download Node from $url"
    else
        die "Need curl or wget to download Node.js"
    fi
    rm -rf "$NODE_DIR"
    mkdir -p "$NODE_DIR"
    tar -xzf "$tarball" -C "$NODE_DIR" --strip-components=1 || die "Failed to extract Node"
    rm -f "$tarball"
    export PATH="$NODE_DIR/bin:$PATH"
    node_ok || die "Private Node install did not produce a working node"
    log "Private Node ready: $(node --version)"
}
# Install the branded CLI globally using the (possibly private) node's npm.
install_cli() {
    log "Installing $TAKO_CLI_PACKAGE ..."
    npm install -g "$TAKO_CLI_PACKAGE" || die "npm install -g $TAKO_CLI_PACKAGE failed"
    log "Installed. Run it with: $(command -v tako-remote 2>/dev/null || echo tako-remote)"
}

main() {
    detect_platform
    if node_ok; then
        log "Found Node $(node --version) — using it."
    else
        install_node
    fi
    install_cli
    log "Done. Start remote control with:  tako-remote"
}

main "$@"
