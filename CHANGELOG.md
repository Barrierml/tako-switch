# Changelog

All notable changes to Tako Switch will be documented in this file.

> Tako Switch is a fork of [cc-switch](https://github.com/farion1231/cc-switch). For upstream history prior to the fork, see the cc-switch repository.

## v3.16.2 (2026-06-09)

### Added
- GitHub Actions release pipeline (macOS signed + notarised, Windows MSI + portable, Linux AppImage / deb / rpm)
- Tauri updater wired up with new minisign keypair; auto-update from GitHub Releases
- `.github/` tracked: CI, issue templates, PR template, dependabot, stale bot
- Full README rewrite (en / zh / ja / de) reflecting Tako Switch capabilities

### Changed
- `createUpdaterArtifacts` set to `true` (was previously disabled during fork)
- Updater endpoint simplified to GitHub Releases only
- All release artifact names branded `Tako-Switch-` (was `CC-Switch-`)
- Issue templates, FUNDING, claude.yml system prompt branded to Tako Switch

### Removed
- Remote control feature (RemotePanel, remote.rs, NaCl auth handshake, tako-remote installer) — paused; desktop focuses on local provider switching for now
- `crypto_box`, `ed25519-dalek`, `libc`, `rand` Cargo deps; `qrcode` npm dep

## v3.16.1 (2026-06-08)

### Added
- Built-in Tako provider: seeded into all apps on first run, sort_index 0 (always first)
- Tako OAuth desktop flow: browser-based login via `takoswitch://` deep-link callback
- Tako usage footer: 5h / daily / weekly quota from par, shown under the Tako provider
- Self-contained statusline command (`tako-switch statusline`): no external CLI needed
- Bottom launch bar: one-click terminal with active provider env injected
- Launch guide dialog: per-app commands, CLI install detection, first-run hint
- Top-bar Tako login button + LoginPromptDialog (first-run prompt)
- Tako supported-models showcase in provider advanced config
- Migration: import from `~/.cc-switch` + `~/.tako` CLI (prompted, never silent)
- Tako octopus app icon + provider icon (`#F06858`)

### Changed
- All cc-switch branding replaced (95+ instances): product name, config paths, deep-link scheme, Cargo package, tauri identifier
- Affiliate URLs updated to Tako placeholders
- Fork credit added to README + About page (4 languages)

### Fixed
- Tako provider visibility: seed logic now writes to DB on first launch
- Launch button visibility: all apps show the terminal launch action (not just Claude)
- MigrationPromptDialog: connected to i18n (was hardcoded English)
