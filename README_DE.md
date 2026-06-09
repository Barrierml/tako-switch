<div align="center">

<img src="src/assets/icons/app-icon.png" width="120" alt="Tako Switch" />

# Tako Switch

### Eine Desktop-App zum Verwalten und Starten von Claude Code, Codex, Gemini CLI, OpenCode, OpenClaw und Hermes — mit integriertem Tako Provider, sofort einsatzbereit.

[![Built with Tauri](https://img.shields.io/badge/built%20with-Tauri%202-orange.svg)](https://tauri.app/)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](https://github.com/Barrierml/tako-switch/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

🌐 **Offizielle Website**: [tako.shiroha.tech](https://tako.shiroha.tech)

[English](README.md) | [中文](README_ZH.md) | [日本語](README_JA.md) | Deutsch

</div>

---

## Warum Tako Switch?

Moderne KI-gestützte Coding-Workflows setzen auf mehrere Tools — Claude Code, Codex, Gemini CLI, OpenCode, OpenClaw, Hermes — und jedes davon benötigt eigene JSON-/TOML-/`.env`-Dateien. Provider wechseln heißt Konfigurationsdateien von Hand bearbeiten; MCP-Server, Prompts und Skills verwalten heißt alles fünfmal erledigen.

**Tako Switch** vereint das in einer einzigen Desktop-App. Eine Oberfläche zum Importieren von Providern, Umschalten per Klick, gemeinsame Nutzung von MCP / Prompts / Skills über alle Tools hinweg und Überblick über Nutzung und Kosten des gesamten Stacks. SQLite + atomare Schreibvorgänge schützen Ihre Konfiguration.

- **Eine App, sieben Tools** — Claude Code, Claude Desktop, Codex, Gemini CLI, OpenCode, OpenClaw, Hermes
- **Integrierter Tako Provider** — mit Tako-Konto anmelden (`cr_`-Schlüssel) und sofort mit Claude / Codex / Gemini loslegen, ohne Drittanbieter-Setup
- **50+ Provider-Vorlagen** — Community-Relay-Dienste, AWS Bedrock, NVIDIA NIM und mehr; ein Klick zum Importieren
- **Einheitliche MCP-, Prompt- & Skill-Verwaltung** — einmal konfigurieren, überall synchronisieren mit bidirektionalem Schutz
- **Startleiste am unteren Rand** — `claude`, `codex` oder `gemini` in einem Terminal starten, vorkonfiguriert mit der Umgebung des aktiven Providers
- **Tray-Umschalter** — Provider wechseln, ohne die App zu öffnen
- **Cloud-Sync** — Konfigurationsverzeichnis auf Dropbox, OneDrive, iCloud oder einen beliebigen WebDAV-Server zeigen

## Screenshots

|                Hauptansicht                 |               Provider hinzufügen                |
| :---------------------------------: | :---------------------------------------: |
| ![Hauptansicht](assets/screenshots/main.png) | ![Hinzufügen](assets/screenshots/add.png)        |

> Screenshots zeigen Tako Switch 3.16.x. Die aktuelle Oberfläche kann leicht abweichen.

## Funktionen

### Provider-Verwaltung

- **Sieben Tools, 50+ Vorlagen** — Vorlage wählen oder eigene Konfiguration erstellen; Schlüssel einfügen, fertig
- **Integrierter Tako Provider** — erstklassiger Eintrag in jeder Tool-Liste, bleibt auch nach Neuinstallation erhalten; ein Tako-`cr_`-Schlüssel für Claude / Codex / Gemini
- **Universal Provider** — eine Konfiguration schreiben, gleichzeitig an Claude Code, Codex und Gemini CLI synchronisieren
- Umschalten per Klick, Reihenfolge per Drag & Drop, Import / Export, Schnellzugriff über System-Tray

### Startleiste am unteren Rand

- Eine permanente Leiste am unteren Fensterrand. Klicken öffnet ein Terminal mit bereits gesetzten Umgebungsvariablen des aktiven Providers — `claude`, `codex` oder `gemini` funktionieren sofort
- App-spezifische Startbefehle und CLI-Erkennung; falls `claude` nicht im `PATH` ist, zeigt Tako Switch den Installationsweg an, statt stumm zu scheitern

### Proxy & Failover

- **Lokaler Proxy-Hot-Swap** — Request-Formatkonvertierung, automatisches Failover, Circuit Breaker, Provider-Health-Monitoring
- **App-Level-Proxy-Übernahme** — pro App oder pro Provider einen unabhängigen Proxy für Claude / Codex / Gemini konfigurieren

### MCP, Prompts & Skills

- **Einheitliches MCP-Panel** — MCP-Server für Claude / Codex / Gemini / OpenCode / Hermes verwalten mit bidirektionalem Sync; Deep-Link-Import unterstützt
- **Prompts** — Markdown-Editor mit App-übergreifendem Sync (CLAUDE.md / AGENTS.md / GEMINI.md), Backfill-Schutz
- **Skills** — per GitHub-Repo oder ZIP mit einem Klick installieren; eigene Repo-Registry, Symlink- oder Kopiermodus

### Nutzung & Kostenübersicht

- **Nutzungs-Dashboard** — Ausgaben, Anfragen und Token-Verbrauch aller Provider; Trenddiagramme, Anfragenprotokoll, individuelle Modellpreise
- **Tako-Kontingent-Fußzeile** — beim integrierten Tako Provider das 5h-/Wochen-Fenster direkt in der App einsehen

### Statusleiste (Claude Code)

- Eigenständige Statusleisten-Implementierung: Verzeichnis / Git / Modell / Kosten / Kontext-% mit 🐙 Tako-Tail; umschaltbar in der erweiterten Konfiguration des Tako Providers
- Kein externes CLI erforderlich — `tako-switch` selbst verarbeitet den `statusline`-Unterbefehl

### Sitzungen & Arbeitsbereich

- Sitzungen der unterstützten Tools durchsuchen, filtern und fortsetzen
- **Arbeitsbereich-Editor** (OpenClaw) — Agent-Dateien (AGENTS.md, SOUL.md…) mit Markdown-Vorschau bearbeiten

### System & Plattform

- **Auto-Update** — Tauri-Updater integriert, signierte Releases über GitHub Releases
- **Cloud-Sync** — eigenes Konfigurationsverzeichnis wählen (Dropbox, OneDrive, iCloud, NAS) oder per WebDAV synchronisieren
- **Deep-Link** (`takoswitch://`) — Provider, MCP-Server, Prompts, Skills mit einem Klick importieren
- Hell / Dunkel / System-Theme; Autostart; atomare Schreibvorgänge; automatische Backups; i18n (zh-CN / zh-TW / en / ja)

### Migration

- **Von cc-switch** — `~/.cc-switch` wird beim ersten Start erkannt und ein Import angeboten; nichts wird stillschweigend verschoben
- **Von Tako CLI** — der `apiKey` aus `~/.tako` wird ausgelesen und in den integrierten Tako Provider geschrieben; die Anmeldung erfolgt automatisch

## Schnellstart

1. **Bei Tako anmelden** (Login-Button oben rechts) — öffnet den Browser, schließt OAuth ab und hinterlegt einen `cr_`-Schlüssel im integrierten Tako Provider für Claude / Codex / Gemini.
2. **Oder eigenen Provider hinzufügen** — *Provider hinzufügen* klicken → Vorlage wählen oder eigene erstellen → Schlüssel einfügen.
3. **Provider wechseln** — Hauptfenster: Provider auswählen, *Aktivieren* klicken. Tray-Menü: Provider-Name anklicken. Terminal neu starten (Claude Code übernimmt Änderungen ohne Neustart).
4. **Starten** — Startleiste am unteren Rand klicken, um ein Terminal mit den Umgebungsvariablen des aktiven Providers zu öffnen, dann `claude` / `codex` / `gemini` ausführen.
5. **Offizielle Anmeldung wiederherstellen** — Vorlage *Official login* hinzufügen, dorthin wechseln, den eigenen Login-/OAuth-Flow des CLI ausführen — danach frei hin- und herwechseln.

> Beim ersten Start bietet Tako Switch an, die vorhandene CLI-Tool-Konfiguration als Standard-Provider zu importieren, damit nichts verloren geht.

### MCP, Prompts, Skills & Sitzungen

- **MCP** — *MCP*-Button → Server aus Vorlage oder benutzerdefiniertem JSON hinzufügen → festlegen, zu welchen Apps synchronisiert wird
- **Prompts** — *Prompts*-Button → im Markdown-Editor schreiben → aktivierte Prompts werden in die Live-Datei synchronisiert
- **Skills** — *Skills*-Button → GitHub-Repo durchsuchen / ZIP einfügen → mit einem Klick in unterstützte Apps installieren
- **Sitzungen** — *Sitzungen*-Button → toolübergreifend durchsuchen, filtern und fortsetzen

## Download & Installation

### Systemanforderungen

- **Windows**: Windows 10 oder neuer
- **macOS**: macOS 12 (Monterey) oder neuer (Universal Binary, Apple Silicon + Intel)
- **Linux**: Ubuntu 22.04+ / Debian 11+ / Fedora 34+ oder jede moderne Distribution

### Windows

`Tako-Switch-v{version}-Windows.msi` (Installer) oder `Tako-Switch-v{version}-Windows-Portable.zip` (portabel) von der [Releases](../../releases)-Seite herunterladen.

### macOS

`Tako-Switch-v{version}-macOS.dmg` (empfohlen) oder die `.zip` von [Releases](../../releases) herunterladen. Der Build ist mit einer Apple Developer ID signiert und notarisiert — ein normaler Doppelklick genügt, kein `xattr`-Workaround nötig.

### Linux

- **AppImage**: `Tako-Switch-v{version}-Linux-x86_64.AppImage` / `-arm64.AppImage`. Ausführbar machen (`chmod +x`) und starten.
- **Debian / Ubuntu**: `sudo dpkg -i Tako-Switch-v{version}-Linux-x86_64.deb`
- **Fedora / openSUSE**: `sudo rpm -i Tako-Switch-v{version}-Linux-x86_64.rpm`
- **Arch**: Ein AUR-Paket folgt möglicherweise; vorerst das AppImage / deb verwenden.

### Auto-Update

Tako Switch nutzt den Tauri-Updater. Neue Releases sind signiert (minisign) und werden über `https://github.com/Barrierml/tako-switch/releases/latest/download/latest.json` erkannt; Sie erhalten eine In-App-Benachrichtigung und können mit einem Klick aktualisieren.

## FAQ

<details>
<summary><strong>Welche KI-Tools unterstützt Tako Switch?</strong></summary>

Sieben Tools, jeweils mit eigenen Provider-Vorlagen und Konfiguration: **Claude Code**, **Claude Desktop**, **Codex**, **Gemini CLI**, **OpenCode**, **OpenClaw** und **Hermes**.

</details>

<details>
<summary><strong>Muss ich mein Terminal nach einem Provider-Wechsel neu starten?</strong></summary>

Bei den meisten Tools ja — die Konfiguration wird beim Start gelesen. **Claude Code** ist die Ausnahme: Es übernimmt den aktiven Provider ohne Neustart.

</details>

<details>
<summary><strong>Was ist der integrierte Tako Provider?</strong></summary>

Ein einzelnes Abonnement, das Ihnen Claude-, Codex- und Gemini-Zugriff über das Tako-Gateway gibt. Nach der Anmeldung wird Ihr `cr_`-Schlüssel in die Konfiguration aller drei Apps geschrieben; die Nutzung wird gegen Ihren Tako-Plan verrechnet. In der erweiterten Konfiguration des Providers sehen Sie Ihre 5h-/Tages-/Wochenlimits und können die Claude Code-Statusleiste umschalten.

</details>

<details>
<summary><strong>Warum kann ich den aktiven Provider nicht löschen?</strong></summary>

Tako Switch folgt der Regel „minimaler Eingriff": Selbst bei Deinstallation der App sollen die verwalteten Tools weiterhin funktionieren. Deshalb wird immer ein aktiver Provider beibehalten. Wenn Sie ein bestimmtes Tool nicht nutzen, blenden Sie es stattdessen in den Einstellungen aus.

</details>

<details>
<summary><strong>Wie wechsle ich zurück zur offiziellen Anmeldung?</strong></summary>

Fügen Sie die Vorlage *Official login* für das jeweilige Tool hinzu, wechseln Sie dorthin und durchlaufen Sie den eigenen Abmelde-/Anmelde-Flow des Tools. Danach können Sie frei zwischen offiziell und Drittanbieter wechseln. (Codex unterstützt sogar mehrere offizielle Konten.)

</details>

<details>
<summary><strong>Wo werden meine Daten gespeichert?</strong></summary>

- **Datenbank**: `~/.tako-switch/tako-switch.db` (SQLite — Provider, MCP, Prompts, Skills)
- **Einstellungen**: `~/.tako-switch/settings.json` (gerätespezifische UI-Präferenzen)
- **Backups**: `~/.tako-switch/backups/` (automatisch rotiert, behält die letzten 10)
- **Skills**: `~/.tako-switch/skills/` (standardmäßig per Symlink in die Ziel-Apps eingebunden)
- **Skill-Backups**: `~/.tako-switch/skill-backups/` (vor Deinstallation erstellt, behält die letzten 20)

</details>

<details>
<summary><strong>Ist mein Tako-`cr_`-Schlüssel sicher?</strong></summary>

Er wird als Teil des aktiven Provider-Eintrags in der lokalen SQLite-Datenbank gespeichert, mit denselben atomaren Schreibschutz-Mechanismen wie alles andere. Die Login-Oberfläche maskiert ihn standardmäßig; das Augen-Symbol zeigt ihn an. Der Schlüssel verlässt Ihren Rechner nur in Richtung Tako-Gateway.

</details>

## Danksagungen

Tako Switch ist ein Fork von **[cc-switch](https://github.com/farion1231/cc-switch)** von [Jason Young (farion1231)](https://github.com/farion1231), veröffentlicht unter der MIT-Lizenz. Die saubere Provider-Switching-Architektur des Originalprojekts bildet das Fundament dieser App — Startleiste, Tako Provider, Statusleiste, Auto-Update-Pipeline und Tako-Branding wurden darauf aufgebaut. Großer Dank an die cc-switch-Autoren und Mitwirkenden. 🙏

## Mitwirken

Issues und Pull Requests sind willkommen. `pnpm install` gefolgt von `pnpm tauri dev` startet einen Dev-Build. Frontend unter `src/`, Rust-Backend unter `src-tauri/`.

## Lizenz

MIT — siehe [LICENSE](LICENSE). Copyright für die ursprünglichen cc-switch-Autoren beibehalten; Tako Switch-Änderungen © 2026 Tako.
