<div align="center">

<img src="src/assets/icons/app-icon.png" width="120" alt="Tako Switch" />

# Tako Switch

### One desktop app to manage and launch Claude Code, Codex, Gemini CLI, OpenCode, OpenClaw and Hermes — with a built-in Tako provider you can use out of the box.

[![Built with Tauri](https://img.shields.io/badge/built%20with-Tauri%202-orange.svg)](https://tauri.app/)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](https://github.com/Barrierml/tako-switch/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

🌐 **Official website**: [tako.shiroha.tech](https://tako.shiroha.tech)

English | [中文](README_ZH.md) | [日本語](README_JA.md) | [Deutsch](README_DE.md)

</div>

---

## Why Tako Switch?

Modern AI coding workflows lean on a stack of tools — Claude Code, Codex, Gemini CLI, OpenCode, OpenClaw, Hermes — and each one wants its own JSON / TOML / `.env` file. Switching API providers means hand-editing config files; managing MCP servers, prompts and skills means doing it five times over.

**Tako Switch** wraps all of that into a single desktop app. One UI to import providers, swap them with one click, share MCP / prompts / skills across tools, and watch usage and cost roll up across the whole stack. SQLite + atomic writes keep your config safe.

- **One app, seven tools** — Claude Code, Claude Desktop, Codex, Gemini CLI, OpenCode, OpenClaw, Hermes
- **Tako provider built-in** — sign in with your Tako account (`cr_` key) and you're ready to code on Claude / Codex / Gemini, no third-party setup required
- **50+ provider presets** — community relay services, AWS Bedrock, NVIDIA NIM and more; one click to import
- **Unified MCP, Prompts & Skills** — manage them once, sync everywhere with two-way protection
- **Bottom launch bar** — start `claude`, `codex` or `gemini` in a terminal pre-configured with the active provider's env
- **Tray switcher** — flip providers without opening the full app
- **Cloud sync** — point your config dir at Dropbox, OneDrive, iCloud or any WebDAV server

## Screenshots

|                Main                 |               Add provider                |
| :---------------------------------: | :---------------------------------------: |
| ![Main](assets/screenshots/main.png) | ![Add](assets/screenshots/add.png)        |

> Screenshots reflect Tako Switch 3.16.x. Live UI may differ slightly.

## Features

### Provider management

- **Seven tools, 50+ presets** — pick a preset or create a custom config; copy in your key and you're done
- **Tako built-in provider** — first-class entry on every tool's list, persists across reinstalls; one Tako `cr_` key powers Claude / Codex / Gemini
- **Universal provider** — write one config, sync it to Claude Code, Codex and Gemini CLI together
- One-click switching, drag-to-reorder, import / export, system tray fast access

### Bottom launch bar

- A persistent launch bar at the bottom of the window. Click it to open a terminal with the active provider's env already injected — `claude`, `codex` or `gemini` Just Works™
- Per-app launch commands and CLI install detection; if `claude` isn't on `PATH`, Tako Switch tells you where to get it instead of failing silently

### Proxy & failover

- **Local proxy hot-swap** — request format conversion, automatic failover, circuit breakers, provider health monitoring
- **App-level proxy takeover** — wire a per-app or per-provider proxy independently for Claude / Codex / Gemini

### MCP, Prompts & Skills

- **Unified MCP panel** — manage MCP servers across Claude / Codex / Gemini / OpenCode / Hermes with two-way sync; deep-link import supported
- **Prompts** — Markdown editor with cross-app sync (CLAUDE.md / AGENTS.md / GEMINI.md), backfill protection
- **Skills** — install from a GitHub repo or zip with one click; custom repo registry, symlink or copy modes

### Usage & cost tracking

- **Usage dashboard** — spend, requests and token usage across all providers; trend charts, request log, custom model pricing
- **Tako quota footer** — for the built-in Tako provider, see your 5h / weekly window usage right inside the app

### Statusline (Claude Code)

- A self-contained statusline implementation: dir / git / model / cost / context % with a 🐙 Tako tail; toggleable from the Tako provider's advanced config
- No external CLI required — `tako-switch` itself handles the `statusline` subcommand

### Sessions & workspace

- Browse, search and resume sessions across supported tools
- **Workspace editor** (OpenClaw) — edit Agent files (AGENTS.md, SOUL.md…) with Markdown preview

### System & platform

- **Auto-update** — Tauri updater wired up, signed releases via GitHub Releases
- **Cloud sync** — pick a custom config dir (Dropbox, OneDrive, iCloud, NAS) or sync via WebDAV
- **Deep-link** (`takoswitch://`) — one-click import of providers, MCP servers, prompts, skills
- Light / dark / system theme; launch on login; atomic writes; auto backups; i18n (zh-CN / zh-TW / en / ja)

### Migrate in

- **From cc-switch** — `~/.cc-switch` is detected on first run and you're prompted to import; nothing is moved silently
- **From Tako CLI** — your `~/.tako` `apiKey` is picked up and written into the built-in Tako provider; sign-in just happens

## Quick start

1. **Sign in to Tako** (top-right login button) — opens a browser, completes OAuth, and drops a `cr_` key into the built-in Tako provider for Claude / Codex / Gemini.
2. **Or add your own provider** — click *Add provider* → pick a preset or create a custom one → paste in your key.
3. **Switch providers** — main window: pick a provider, hit *Activate*. Tray menu: click the provider name. Restart the terminal (Claude Code hot-swaps without one).
4. **Launch** — click the bottom launch bar to open a terminal with the active provider's env already injected, then run `claude` / `codex` / `gemini`.
5. **Restore official sign-in** — add an *Official login* preset, switch to it, run the CLI's own login / OAuth flow, and you can flip back and forth freely.

> First run: Tako Switch offers to import your existing CLI tool config as the default provider, so you don't lose what you already had.

### MCP, Prompts, Skills & Sessions

- **MCP** — *MCP* button → add a server from a template or custom JSON → toggle which apps it syncs to
- **Prompts** — *Prompts* button → write in the Markdown editor → activated prompts sync to the live file
- **Skills** — *Skills* button → browse a GitHub repo / paste a zip → install to supported apps in one click
- **Sessions** — *Sessions* button → browse, search and resume across tools

## Download & install

### System requirements

- **Windows**: Windows 10 or newer
- **macOS**: macOS 12 (Monterey) or newer (universal binary, Apple Silicon + Intel)
- **Linux**: Ubuntu 22.04+ / Debian 11+ / Fedora 34+ or any modern distro

### Windows

Grab `Tako-Switch-v{version}-Windows.msi` (installer) or `Tako-Switch-v{version}-Windows-Portable.zip` (no-install) from the [Releases](../../releases) page.

### macOS

Download `Tako-Switch-v{version}-macOS.dmg` (recommended) or the `.zip` from [Releases](../../releases). The build is signed with an Apple Developer ID and notarised, so it opens with a normal double-click on first run — no `xattr` workaround needed.

### Linux

- **AppImage**: `Tako-Switch-v{version}-Linux-x86_64.AppImage` / `-arm64.AppImage`. Make it executable (`chmod +x`) and run.
- **Debian / Ubuntu**: `sudo dpkg -i Tako-Switch-v{version}-Linux-x86_64.deb`
- **Fedora / openSUSE**: `sudo rpm -i Tako-Switch-v{version}-Linux-x86_64.rpm`
- **Arch**: an AUR package may follow; for now grab the AppImage / deb.

### Auto-update

Tako Switch ships with the Tauri updater. New releases are signed (minisign) and discovered via `https://github.com/Barrierml/tako-switch/releases/latest/download/latest.json`; you'll get an in-app prompt and one-click update.

## FAQ

<details>
<summary><strong>Which AI tools does Tako Switch support?</strong></summary>

Seven tools, all with their own provider presets and config: **Claude Code**, **Claude Desktop**, **Codex**, **Gemini CLI**, **OpenCode**, **OpenClaw** and **Hermes**.

</details>

<details>
<summary><strong>Do I need to restart my terminal after switching providers?</strong></summary>

For most tools, yes — config is read on startup. **Claude Code** is the exception; it hot-swaps the active provider without a restart.

</details>

<details>
<summary><strong>What is the built-in Tako provider?</strong></summary>

A single subscription that gives you Claude, Codex and Gemini access through the Tako gateway. After signing in, your `cr_` key is written into all three apps' configs; usage is metered against your Tako plan. Open the provider's advanced config to see your 5h / daily / weekly limits and toggle the Claude Code statusline.

</details>

<details>
<summary><strong>Why can't I delete the active provider?</strong></summary>

Tako Switch's "least intrusive" rule: even if you uninstall the app, the wrapped tools still need to work. So we always keep one active provider. If you don't use a particular app, hide it in Settings instead.

</details>

<details>
<summary><strong>How do I switch back to the official login?</strong></summary>

Add the *Official login* preset for the tool, switch to it, and run that tool's own `Log out` / `Log in` flow. After that you can flip between official and third-party freely. (Codex even lets you keep multiple official accounts.)

</details>

<details>
<summary><strong>Where is my data stored?</strong></summary>

- **Database**: `~/.tako-switch/tako-switch.db` (SQLite — providers, MCP, prompts, skills)
- **Settings**: `~/.tako-switch/settings.json` (per-device UI preferences)
- **Backups**: `~/.tako-switch/backups/` (auto-rotated, keeps the last 10)
- **Skills**: `~/.tako-switch/skills/` (symlinked into the target apps by default)
- **Skill backups**: `~/.tako-switch/skill-backups/` (created before uninstall, keeps the last 20)

</details>

<details>
<summary><strong>Is my Tako `cr_` key safe?</strong></summary>

It's stored as part of the active provider record in the local SQLite database, with the same atomic-write protections as everything else. The login UI masks it by default; toggle the eye icon to reveal. The key never leaves your machine except to the Tako gateway.

</details>

## Acknowledgements

Tako Switch is a fork of **[cc-switch](https://github.com/farion1231/cc-switch)** by [Jason Young (farion1231)](https://github.com/farion1231), released under the MIT License. The original project's clean provider-switching architecture is the foundation of this app — the launcher bar, Tako provider, statusline, auto-update pipeline and Tako brand are layered on top. Huge thanks to the cc-switch authors and contributors. 🙏

## Contributing

Issues and pull requests welcome. Run `pnpm install` then `pnpm tauri dev` to spin up a dev build. Frontend lives under `src/`, Rust backend under `src-tauri/`.

## License

MIT — see [LICENSE](LICENSE). Copyright retained for the original cc-switch authors; Tako Switch modifications © 2026 Tako.
