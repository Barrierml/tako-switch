<div align="center">

<img src="src/assets/icons/app-icon.png" width="120" alt="Tako Switch" />

# Tako Switch

### Claude Code、Codex、Gemini CLI、OpenCode、OpenClaw、Hermes を一元管理・起動するデスクトップアプリ。Tako provider 内蔵ですぐに使い始められる。

[![Built with Tauri](https://img.shields.io/badge/built%20with-Tauri%202-orange.svg)](https://tauri.app/)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](https://github.com/Barrierml/tako-switch/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

🌐 **公式サイト**: [tako.shiroha.tech](https://tako.shiroha.tech)

[English](README.md) | [中文](README_ZH.md) | 日本語 | [Deutsch](README_DE.md)

</div>

---

## なぜ Tako Switch？

最近の AI コーディングでは複数のツール — Claude Code、Codex、Gemini CLI、OpenCode、OpenClaw、Hermes — を併用するのが当たり前になった。それぞれが独自の JSON / TOML / `.env` を要求し、API provider を切り替えるたびに設定ファイルを手で書き換える必要がある。MCP サーバーやプロンプト、skill の管理も同じ作業を何度も繰り返すことになる。

**Tako Switch** はこれをひとつのデスクトップアプリにまとめる。provider のインポート、ワンクリック切り替え、MCP / プロンプト / skill の横断共有、使用量とコストの一括可視化をひとつの UI で実現。SQLite + アトミック書き込みで設定ファイルを安全に保護する。

- **1 アプリで 7 ツール** — Claude Code、Claude Desktop、Codex、Gemini CLI、OpenCode、OpenClaw、Hermes
- **Tako provider 内蔵** — Tako アカウント（`cr_` キー）でサインインすれば、サードパーティ設定なしで Claude / Codex / Gemini を利用可能
- **50 以上の provider プリセット** — コミュニティリレー、AWS Bedrock、NVIDIA NIM など。ワンクリックでインポート
- **統合 MCP・プロンプト・skill 管理** — 一度設定すれば全ツールに双方向同期
- **ボトムランチバー** — アクティブ provider の env が注入済みのターミナルで `claude`、`codex`、`gemini` を起動
- **トレイスイッチャー** — フルアプリを開かずに provider を切り替え
- **クラウド同期** — 設定ディレクトリを Dropbox、OneDrive、iCloud、任意の WebDAV サーバーに向けるだけ

## スクリーンショット

|                メイン                 |               provider 追加                |
| :---------------------------------: | :---------------------------------------: |
| ![Main](assets/screenshots/main.png) | ![Add](assets/screenshots/add.png)        |

> スクリーンショットは Tako Switch 3.16.x 時点のもの。実際の UI は多少異なる場合がある。

## 機能

### Provider 管理

- **7 ツール・50 以上のプリセット** — プリセットを選ぶかカスタム設定を作成し、キーを貼り付けるだけ
- **Tako 内蔵 provider** — 全ツールのリストに常駐し再インストールでも維持。1 つの Tako `cr_` キーで Claude / Codex / Gemini を利用
- **ユニバーサル provider** — 設定を一度書けば Claude Code、Codex、Gemini CLI にまとめて反映
- ワンクリック切り替え、ドラッグ並べ替え、インポート / エクスポート、システムトレイからの高速アクセス

### ボトムランチバー

- ウィンドウ下部の常駐ランチバー。クリックするとアクティブ provider の env が注入済みのターミナルが開き、`claude`、`codex`、`gemini` がそのまま動く
- アプリごとの起動コマンドと CLI 検出。`claude` が `PATH` にない場合、黙って失敗せず入手先を案内

### プロキシ＆フェイルオーバー

- **ローカルプロキシ ホットスワップ** — リクエスト形式変換、自動フェイルオーバー、サーキットブレーカー、provider ヘルスモニタリング
- **アプリレベル プロキシ乗っ取り** — Claude / Codex / Gemini ごとに per-app / per-provider プロキシを個別設定

### MCP・プロンプト・skill

- **統合 MCP パネル** — Claude / Codex / Gemini / OpenCode / Hermes の MCP サーバーを双方向同期で管理。deep-link インポート対応
- **プロンプト** — Markdown エディタ付きクロスアプリ同期（CLAUDE.md / AGENTS.md / GEMINI.md）、バックフィル保護
- **skill** — GitHub リポジトリまたは zip からワンクリックインストール。カスタムリポジトリレジストリ、symlink / copy モード

### 使用量＆コスト追跡

- **使用量ダッシュボード** — 全 provider の支出・リクエスト数・トークン使用量、トレンドチャート、リクエストログ、カスタムモデル料金
- **Tako クォータフッター** — 内蔵 Tako provider の 5h / 週間ウィンドウ使用量をアプリ内で確認

### Statusline（Claude Code）

- 自己完結型 statusline 実装：dir / git / model / cost / context % を表示。Tako provider の詳細設定からトグル可能
- 外部 CLI 不要 — `tako-switch` 自体が `statusline` サブコマンドを処理

### セッション＆ワークスペース

- 対応ツール全体のセッションを一覧・検索・再開
- **ワークスペースエディタ**（OpenClaw）— AGENTS.md、SOUL.md 等の Agent ファイルを Markdown プレビュー付きで編集

### システム＆プラットフォーム

- **自動アップデート** — Tauri updater 連携。GitHub Releases 経由で署名付きリリース
- **クラウド同期** — カスタム設定ディレクトリ（Dropbox、OneDrive、iCloud、NAS）または WebDAV 経由で同期
- **Deep-link**（`takoswitch://`）— provider、MCP サーバー、プロンプト、skill をワンクリックインポート
- ライト / ダーク / システムテーマ、ログイン時起動、アトミック書き込み、自動バックアップ、i18n（zh-CN / zh-TW / en / ja）

### マイグレーション

- **cc-switch から** — 初回起動時に `~/.cc-switch` を検出し、インポートを提案。無断で移動されることはない
- **Tako CLI から** — `~/.tako` の `apiKey` を自動検出し、内蔵 Tako provider に書き込む。サインインは自動

## クイックスタート

1. **Tako にサインイン**（右上のログインボタン）— ブラウザが開き、OAuth を完了すると `cr_` キーが内蔵 Tako provider に書き込まれ、Claude / Codex / Gemini で利用可能になる。
2. **自分の provider を追加** — *Add provider* → プリセットを選ぶかカスタム作成 → キーを貼り付け。
3. **Provider 切り替え** — メインウィンドウ: provider を選んで *Activate*。トレイメニュー: provider 名をクリック。ターミナルを再起動（Claude Code はホットスワップ対応で再起動不要）。
4. **起動** — ボトムランチバーをクリックしてアクティブ provider の env が注入されたターミナルを開き、`claude` / `codex` / `gemini` を実行。
5. **公式ログインに戻す** — *Official login* プリセットを追加 → 切り替え → CLI 自体のログイン / OAuth フローを実行。以降は自由に切り替え可能。

> 初回起動時、Tako Switch は既存の CLI ツール設定をデフォルト provider としてインポートすることを提案する。既存の設定は失われない。

### MCP・プロンプト・skill・セッション

- **MCP** — *MCP* ボタン → テンプレートまたはカスタム JSON でサーバーを追加 → どのアプリに同期するかトグルで切り替え
- **プロンプト** — *Prompts* ボタン → Markdown エディタで記述 → 有効化するとライブファイルに同期
- **skill** — *Skills* ボタン → GitHub リポジトリを閲覧 / zip を貼り付け → 対応アプリにワンクリックインストール
- **セッション** — *Sessions* ボタン → ツール横断で一覧・検索・再開

## ダウンロード＆インストール

### システム要件

- **Windows**: Windows 10 以上
- **macOS**: macOS 12 (Monterey) 以上（ユニバーサルバイナリ、Apple Silicon + Intel）
- **Linux**: Ubuntu 22.04+ / Debian 11+ / Fedora 34+ など主要ディストリビューション

### Windows

[Releases](../../releases) ページから `Tako-Switch-v{version}-Windows.msi`（インストーラー）または `Tako-Switch-v{version}-Windows-Portable.zip`（インストール不要）をダウンロード。

### macOS

[Releases](../../releases) から `Tako-Switch-v{version}-macOS.dmg`（推奨）または `.zip` をダウンロード。Apple Developer ID で署名・公証済みのため、初回起動時もダブルクリックで開ける — `xattr` の回避策は不要。

### Linux

- **AppImage**: `Tako-Switch-v{version}-Linux-x86_64.AppImage` / `-arm64.AppImage`。実行権限を付与（`chmod +x`）して起動。
- **Debian / Ubuntu**: `sudo dpkg -i Tako-Switch-v{version}-Linux-x86_64.deb`
- **Fedora / openSUSE**: `sudo rpm -i Tako-Switch-v{version}-Linux-x86_64.rpm`
- **Arch**: AUR パッケージは追って公開予定。現時点では AppImage / deb を利用。

### 自動アップデート

Tako Switch には Tauri updater が組み込まれている。新リリースは minisign で署名され、`https://github.com/Barrierml/tako-switch/releases/latest/download/latest.json` 経由で検出。アプリ内プロンプトからワンクリックで更新できる。

## FAQ

<details>
<summary><strong>Tako Switch はどの AI ツールに対応している？</strong></summary>

7 つのツールに対応し、それぞれ独自の provider プリセットと設定を持つ: **Claude Code**、**Claude Desktop**、**Codex**、**Gemini CLI**、**OpenCode**、**OpenClaw**、**Hermes**。

</details>

<details>
<summary><strong>Provider 切り替え後、ターミナルの再起動は必要？</strong></summary>

ほとんどのツールでは必要 — 設定は起動時に読み込まれる。**Claude Code** は例外で、アクティブ provider を再起動なしでホットスワップする。

</details>

<details>
<summary><strong>内蔵 Tako provider とは？</strong></summary>

Tako ゲートウェイ経由で Claude、Codex、Gemini にアクセスできる単一サブスクリプション。サインインすると `cr_` キーが 3 つのアプリの設定に書き込まれ、使用量は Tako プランで計測される。provider の詳細設定を開くと 5h / daily / weekly の上限と Claude Code statusline のトグルが確認できる。

</details>

<details>
<summary><strong>アクティブな provider を削除できないのはなぜ？</strong></summary>

Tako Switch の「最小介入」ルール: アプリをアンインストールしても各ツールが動作し続けるよう、常にアクティブ provider を 1 つ保持する。特定のアプリを使わない場合は、設定で非表示にできる。

</details>

<details>
<summary><strong>公式ログインに戻すには？</strong></summary>

対象ツールの *Official login* プリセットを追加し、切り替えてからそのツール自体の `Log out` / `Log in` フローを実行。以降は公式とサードパーティを自由に行き来できる（Codex は複数の公式アカウントにも対応）。

</details>

<details>
<summary><strong>データはどこに保存される？</strong></summary>

- **データベース**: `~/.tako-switch/tako-switch.db`（SQLite — provider、MCP、プロンプト、skill）
- **設定**: `~/.tako-switch/settings.json`（デバイスごとの UI 設定）
- **バックアップ**: `~/.tako-switch/backups/`（自動ローテーション、直近 10 件を保持）
- **skill**: `~/.tako-switch/skills/`（デフォルトで対象アプリに symlink）
- **skill バックアップ**: `~/.tako-switch/skill-backups/`（アンインストール前に作成、直近 20 件を保持）

</details>

<details>
<summary><strong>Tako の `cr_` キーは安全？</strong></summary>

ローカル SQLite データベースのアクティブ provider レコードに保存され、他のデータと同じアトミック書き込みで保護される。ログイン UI ではデフォルトでマスク表示、目のアイコンで切り替え可能。キーは Tako ゲートウェイ以外に送信されない。

</details>

## 謝辞

Tako Switch は [Jason Young (farion1231)](https://github.com/farion1231) による **[cc-switch](https://github.com/farion1231/cc-switch)** のフォークであり、MIT ライセンスで公開されている。オリジナルの洗練された provider 切り替えアーキテクチャがこのアプリの土台となっており、ランチバー、Tako provider、statusline、自動アップデートパイプライン、Tako ブランドはその上に構築された。cc-switch の作者とコントリビューターに深く感謝する。

## コントリビュート

Issue と Pull Request を歓迎。開発ビルドを起動するには `pnpm install` → `pnpm tauri dev`。フロントエンドは `src/`、Rust バックエンドは `src-tauri/` に配置されている。

## ライセンス

MIT — [LICENSE](LICENSE) を参照。オリジナル cc-switch 作者の著作権を維持。Tako Switch の変更部分は (C) 2026 Tako。
