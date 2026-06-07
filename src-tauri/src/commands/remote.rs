#![allow(non_snake_case)]

//! Tako remote control — drives the local `tako-remote` (Happy) CLI daemon so
//! a user can hand off the current coding session to phone/browser via the
//! self-hosted Tako backend. This is the cc-switch ↔ Happy fusion seam:
//! Tako Switch spawns and manages the daemon, injecting the server URL + the
//! user's Tako key. Additive — no upstream files changed.

use std::process::Stdio;
use tokio::process::Command;

const TAKO_SERVER_URL: &str = "https://happy.shiroha.tech";
const REMOTE_BIN: &str = "tako-remote";
const INSTALL_URL: &str = "https://tako.shiroha.tech/install.sh";

#[derive(serde::Serialize)]
pub struct RemoteStatus {
    pub installed: bool,
    pub running: bool,
    pub version: Option<String>,
}

fn no_window(cmd: &mut Command) {
    let _ = cmd;
    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        cmd.creation_flags(0x08000000);
    }
}

/// Is the tako-remote CLI installed and on PATH? Returns version if so.
#[tauri::command]
pub async fn remote_status() -> Result<RemoteStatus, String> {
    let mut cmd = Command::new(REMOTE_BIN);
    cmd.arg("--version").stdout(Stdio::piped()).stderr(Stdio::null());
    no_window(&mut cmd);

    match cmd.output().await {
        Ok(out) if out.status.success() => {
            let version = String::from_utf8_lossy(&out.stdout).trim().to_string();
            Ok(RemoteStatus {
                installed: true,
                running: is_daemon_running().await,
                version: if version.is_empty() { None } else { Some(version) },
            })
        }
        _ => Ok(RemoteStatus { installed: false, running: false, version: None }),
    }
}

async fn is_daemon_running() -> bool {
    let mut cmd = Command::new(REMOTE_BIN);
    cmd.args(["daemon", "status"]).stdout(Stdio::null()).stderr(Stdio::null());
    no_window(&mut cmd);
    matches!(cmd.status().await, Ok(s) if s.success())
}

/// Start the local daemon, injecting server URL + Tako key. Returns the
/// bind URL / QR payload the user scans from phone/web.
#[tauri::command]
pub async fn remote_start_daemon(takoKey: String) -> Result<String, String> {
    if takoKey.trim().is_empty() {
        return Err("Tako key is required to start remote control".into());
    }
    let mut cmd = Command::new(REMOTE_BIN);
    cmd.args(["daemon", "start"])
        .env("HAPPY_SERVER_URL", TAKO_SERVER_URL)
        .env("HAPPY_TAKO_KEY", takoKey)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());
    no_window(&mut cmd);

    let out = cmd.output().await.map_err(|e| format!("Failed to start daemon: {e}"))?;
    if !out.status.success() {
        return Err(format!("Daemon failed to start: {}", String::from_utf8_lossy(&out.stderr)));
    }
    // The CLI prints the bind URL / auth payload on stdout.
    Ok(String::from_utf8_lossy(&out.stdout).trim().to_string())
}

/// Stop the local daemon.
#[tauri::command]
pub async fn remote_stop_daemon() -> Result<bool, String> {
    let mut cmd = Command::new(REMOTE_BIN);
    cmd.args(["daemon", "stop"]).stdout(Stdio::null()).stderr(Stdio::null());
    no_window(&mut cmd);
    let status = cmd.status().await.map_err(|e| format!("Failed to stop daemon: {e}"))?;
    Ok(status.success())
}

/// Trigger the one-click install path (Node auto-install + CLI). macOS/Linux
/// run the shell installer; Windows users are pointed at the download page.
#[tauri::command]
pub async fn remote_install() -> Result<bool, String> {
    #[cfg(target_os = "windows")]
    {
        return Err("On Windows, install tako-remote from the download page.".into());
    }
    #[cfg(not(target_os = "windows"))]
    {
        let script = format!("curl -fsSL {INSTALL_URL} | bash");
        let mut cmd = Command::new("bash");
        cmd.args(["-lc", &script]).stdout(Stdio::piped()).stderr(Stdio::piped());
        no_window(&mut cmd);
        let out = cmd.output().await.map_err(|e| format!("Install failed to launch: {e}"))?;
        if !out.status.success() {
            return Err(format!("Install failed: {}", String::from_utf8_lossy(&out.stderr)));
        }
        Ok(true)
    }
}

// ── Tako statusline ─────────────────────────────────────────────
// Inject/remove Tako's statusline into ~/.claude/settings.json. The statusline
// is rendered by `tako-remote statusline` (dir/git/model/context/quota).

fn claude_settings_path() -> std::path::PathBuf {
    crate::config::get_home_dir().join(".claude").join("settings.json")
}

/// The command Claude Code runs for the statusline. Points at the Tako Switch
/// binary itself (`<exe> statusline`) so it works without the Tako CLI.
fn statusline_command() -> String {
    let exe = std::env::current_exe()
        .ok()
        .and_then(|p| p.to_str().map(String::from))
        .unwrap_or_else(|| "tako-switch".to_string());
    format!("\"{exe}\" statusline")
}

/// Whether the Tako statusline is currently configured in Claude settings.
#[tauri::command]
pub async fn tako_statusline_status() -> Result<bool, String> {
    let path = claude_settings_path();
    let Ok(text) = std::fs::read_to_string(&path) else {
        return Ok(false);
    };
    let json: serde_json::Value = serde_json::from_str(&text).unwrap_or_default();
    let cmd = json
        .get("statusLine")
        .and_then(|s| s.get("command"))
        .and_then(|c| c.as_str())
        .unwrap_or("");
    Ok(cmd.contains("statusline"))
}

/// Inject the Tako statusline into ~/.claude/settings.json (preserving other keys).
#[tauri::command]
pub async fn tako_statusline_enable() -> Result<bool, String> {
    let path = claude_settings_path();
    let mut json: serde_json::Value = std::fs::read_to_string(&path)
        .ok()
        .and_then(|t| serde_json::from_str(&t).ok())
        .unwrap_or_else(|| serde_json::json!({}));

    json["statusLine"] = serde_json::json!({
        "type": "command",
        "command": statusline_command(),
        "padding": 0,
    });

    if let Some(dir) = path.parent() {
        std::fs::create_dir_all(dir).map_err(|e| format!("mkdir failed: {e}"))?;
    }
    std::fs::write(&path, serde_json::to_string_pretty(&json).unwrap())
        .map_err(|e| format!("write failed: {e}"))?;
    Ok(true)
}

/// Remove only the Tako statusline (leave user's other config untouched).
#[tauri::command]
pub async fn tako_statusline_disable() -> Result<bool, String> {
    let path = claude_settings_path();
    let Ok(text) = std::fs::read_to_string(&path) else {
        return Ok(true);
    };
    let mut json: serde_json::Value = serde_json::from_str(&text).unwrap_or_default();
    let is_tako = json
        .get("statusLine")
        .and_then(|s| s.get("command"))
        .and_then(|c| c.as_str())
        .map(|c| c.contains("statusline"))
        .unwrap_or(false);
    if is_tako {
        if let Some(obj) = json.as_object_mut() {
            obj.remove("statusLine");
        }
        std::fs::write(&path, serde_json::to_string_pretty(&json).unwrap())
            .map_err(|e| format!("write failed: {e}"))?;
    }
    Ok(true)
}
