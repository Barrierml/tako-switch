<div align="center">

<img src="src/assets/icons/app-icon.png" width="120" alt="Tako Switch" />

# Tako Switch

### 在一个桌面应用里管理并启动 Claude Code、Codex、Gemini CLI、OpenCode、OpenClaw、Hermes —— 内置 Tako provider，下载即用。

[![Built with Tauri](https://img.shields.io/badge/built%20with-Tauri%202-orange.svg)](https://tauri.app/)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](https://github.com/Barrierml/tako-switch/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

🌐 **官网**：[tako.shiroha.tech](https://tako.shiroha.tech)

[English](README.md) | 中文 | [日本語](README_JA.md) | [Deutsch](README_DE.md)

</div>

---

## 为什么选 Tako Switch？

现在做 AI 编程要同时用一堆工具 —— Claude Code、Codex、Gemini CLI、OpenCode、OpenClaw、Hermes —— 每个都有自己一套 JSON / TOML / `.env` 配置。换一次 API 供应商要手动改一遍配置文件；MCP、prompt、skill 也是同样的事情要做五遍。

**Tako Switch** 把这些事情放进一个桌面应用：一个界面导入供应商、一键切换、跨工具同步 MCP / prompt / skill、跨工具汇总用量与成本。底层 SQLite + 原子写入保护配置安全。

- **一个应用，七个工具** —— Claude Code、Claude Desktop、Codex、Gemini CLI、OpenCode、OpenClaw、Hermes
- **内置 Tako provider** —— 用 Tako 账号（`cr_` key）登录，立即在 Claude / Codex / Gemini 上开工，不用自己接第三方
- **50+ 供应商预设** —— 各类社区中转、AWS Bedrock、NVIDIA NIM 等；一键导入
- **MCP / Prompts / Skills 统一管理** —— 配一次、跨工具双向同步，自带回填保护
- **底部一键启动栏** —— 在终端里启动 `claude`、`codex` 或 `gemini`，环境变量已注入好
- **托盘快速切换** —— 不用打开主窗口也能换供应商
- **云同步** —— 配置目录可以放 Dropbox / OneDrive / iCloud / 任何 WebDAV 服务器

## 界面预览

|              主界面               |             添加供应商              |
| :-------------------------------: | :---------------------------------: |
| ![主界面](assets/screenshots/main-zh.png) | ![添加供应商](assets/screenshots/add-zh.png) |

> 预览图基于 Tako Switch 3.16.x，实际 UI 可能略有不同。

## 功能特性

### 供应商管理

- **七个工具，50+ 预设** —— 选预设或自建；粘贴 key 就能用
- **Tako 内置 provider** —— 默认置顶，重装不丢；一把 Tako `cr_` key 同时点亮 Claude / Codex / Gemini
- **通用 provider** —— 一份配置同步到 Claude Code、Codex、Gemini CLI
- 一键切换、拖拽排序、导入导出、托盘快速访问

### 底部一键启动栏

- 主窗口底部常驻启动栏，点一下打开终端，当前 provider 的环境变量已经注入完毕，直接 `claude` / `codex` / `gemini` 就能跑
- 每个工具有自己的启动命令；CLI 没装时给你装 CLI 的引导，而不是默默失败

### 代理与故障转移

- **本地代理热切换** —— 请求格式转换、自动故障转移、熔断器、供应商健康监控
- **应用级代理接管** —— 单独给 Claude / Codex / Gemini 或单个 provider 配代理

### MCP、Prompts 与 Skills

- **统一 MCP 面板** —— 跨 Claude / Codex / Gemini / OpenCode / Hermes 管理 MCP 服务器，双向同步，支持 deep-link 导入
- **Prompts** —— Markdown 编辑器，跨应用同步（CLAUDE.md / AGENTS.md / GEMINI.md），自带回填保护
- **Skills** —— 从 GitHub 仓库或 zip 一键安装；自定义仓库注册表，软链或文件复制模式可选

### 用量与成本

- **用量看板** —— 跨供应商汇总开销、请求数、token 用量；趋势图、请求日志、自定义模型定价
- **Tako 用量底栏** —— 内置 Tako provider 在应用内直接看 5 小时 / 每周用量

### 状态栏（Claude Code）

- 自带 statusline 实现：目录 / git / model / cost / 上下文 % + 🐙 Tako 小尾巴；在 Tako provider 高级配置里开关
- 不依赖外部 CLI，`tako-switch` 二进制本身处理 `statusline` 子命令

### 会话与工作区

- 跨工具浏览、搜索、恢复会话
- **工作区编辑器**（OpenClaw）—— 编辑 Agent 文件（AGENTS.md、SOUL.md…），支持 Markdown 预览

### 系统与平台

- **自动更新** —— 接通 Tauri updater，签名后通过 GitHub Releases 分发
- **云同步** —— 自定义配置目录（Dropbox、OneDrive、iCloud、坚果云、NAS）或 WebDAV 同步
- **Deep Link**（`takoswitch://`）—— URL 一键导入供应商、MCP、prompt、skill
- 浅色 / 深色 / 跟随系统主题；开机自启；原子写入；自动备份；i18n（简中 / 繁中 / 英 / 日）

### 一键迁移

- **从 cc-switch 迁** —— 第一次启动检测到 `~/.cc-switch` 会弹窗问你要不要导入；不会静默搬数据
- **从 Tako CLI 迁** —— 自动读取 `~/.tako` 里的 `apiKey` 写入内置 Tako provider，登录态直接续上

## 快速上手

1. **登录 Tako**（右上角登录按钮）—— 浏览器 OAuth 完成后 `cr_` key 自动写入内置 Tako provider，Claude / Codex / Gemini 立刻可用。
2. **或者自己添加供应商** —— 点"添加供应商" → 选预设或自建 → 粘贴 key。
3. **切换供应商** —— 主界面选中后点"启用"；或者在系统托盘直接点供应商名（立即生效）。重启终端让配置生效（Claude Code 免重启）。
4. **启动** —— 点底部启动栏，打开的终端里环境变量已注入好，直接跑 `claude` / `codex` / `gemini`。
5. **恢复官方登录** —— 添加"官方登录"预设并切换过去，执行 CLI 自带的 Login / OAuth 流程即可。

> 首次启动会提示你导入已有 CLI 配置作为默认供应商，已有配置不会丢。

### MCP、Prompts、Skills 与会话

- **MCP** —— MCP 按钮 → 从模板或自定义 JSON 添加服务器 → 选择同步到哪些应用
- **Prompts** —— Prompts 按钮 → Markdown 编辑器编写 → 激活后同步到对应工具的 live 文件
- **Skills** —— Skills 按钮 → 浏览 GitHub 仓库 / 粘 zip → 一键安装到支持的应用
- **会话** —— Sessions 按钮 → 跨工具浏览、搜索、恢复

## 下载安装

### 系统要求

- **Windows**：Windows 10 及以上
- **macOS**：macOS 12 (Monterey) 及以上（通用二进制，Apple Silicon + Intel）
- **Linux**：Ubuntu 22.04+ / Debian 11+ / Fedora 34+ 等主流发行版

### Windows

从 [Releases](../../releases) 页面下载 `Tako-Switch-v{版本号}-Windows.msi`（安装版）或 `Tako-Switch-v{版本号}-Windows-Portable.zip`（绿色版）。

### macOS

下载 `Tako-Switch-v{版本号}-macOS.dmg`（推荐）或 `.zip`，来自 [Releases](../../releases)。已通过 Apple Developer ID 签名和公证，双击即可打开，无需 `xattr` 操作。

### Linux

- **AppImage**：`Tako-Switch-v{版本号}-Linux-x86_64.AppImage` / `-arm64.AppImage`。`chmod +x` 后直接运行。
- **Debian / Ubuntu**：`sudo dpkg -i Tako-Switch-v{版本号}-Linux-x86_64.deb`
- **Fedora / openSUSE**：`sudo rpm -i Tako-Switch-v{版本号}-Linux-x86_64.rpm`

### 自动更新

Tako Switch 内置 Tauri updater。新版本经 minisign 签名、通过 GitHub Releases 分发；应用启动时自动检查，弹窗提示一键更新。

## 常见问题

<details>
<summary><strong>Tako Switch 支持哪些 AI 工具？</strong></summary>

七个工具，各有专属预设和配置管理：**Claude Code**、**Claude Desktop**、**Codex**、**Gemini CLI**、**OpenCode**、**OpenClaw**、**Hermes**。

</details>

<details>
<summary><strong>切换供应商后需要重启终端吗？</strong></summary>

大多数工具需要重启终端才能让配置生效。例外是 **Claude Code**——它支持热切换，无需重启。

</details>

<details>
<summary><strong>内置 Tako provider 是什么？</strong></summary>

一个通过 Tako 网关统一接入 Claude / Codex / Gemini 的订阅服务。登录后 `cr_` key 写入三个应用的配置，用量按 Tako 套餐计费。在 Tako provider 高级配置里可以看 5 小时 / 日 / 周额度、开关 Claude Code statusline。

</details>

<details>
<summary><strong>为什么不能删除当前激活的供应商？</strong></summary>

Tako Switch 遵循"最小侵入"原则——卸载后被管理的工具仍能正常用。所以始终保留一个激活 provider。不常用的工具可以在设置里隐藏。

</details>

<details>
<summary><strong>如何切换回官方登录？</strong></summary>

添加"官方登录"预设 → 切换 → 执行那个工具自己的 Log out / Log in 流程。之后就可以在官方和第三方之间随意切换。Codex 还支持多个官方账号之间切换。

</details>

<details>
<summary><strong>数据存在哪里？</strong></summary>

- **数据库**：`~/.tako-switch/tako-switch.db`（SQLite —— provider、MCP、prompt、skill）
- **设置**：`~/.tako-switch/settings.json`（本机 UI 偏好）
- **备份**：`~/.tako-switch/backups/`（自动轮转，保留最近 10 个）
- **Skills**：`~/.tako-switch/skills/`（默认软链到对应应用）
- **Skill 备份**：`~/.tako-switch/skill-backups/`（卸载前自动创建，保留最近 20 个）

</details>

<details>
<summary><strong>Tako `cr_` key 安全吗？</strong></summary>

存储在本地 SQLite 的 provider 记录中，享受和所有配置一样的原子写入保护。界面默认掩码显示，点眼睛图标才会展示明文。key 只会发往 Tako 网关，不会发向任何第三方。

</details>

## 致谢

Tako Switch 基于 **[cc-switch](https://github.com/farion1231/cc-switch)**（作者 [Jason Young (farion1231)](https://github.com/farion1231)，MIT 协议）fork 而来。原项目的 provider 切换架构是本应用的基石——启动栏、Tako provider、statusline、自动更新流水线和 Tako 品牌化是在此基础上添加的功能。感谢 cc-switch 的全体作者和贡献者。🙏

## 贡献

欢迎提 Issue 和 Pull Request。开发环境：`pnpm install` → `pnpm tauri dev`。前端在 `src/`，Rust 后端在 `src-tauri/`。

## 许可证

MIT —— 见 [LICENSE](LICENSE)。原始 cc-switch 作者保留版权；Tako Switch 修改部分 © 2026 Tako。
