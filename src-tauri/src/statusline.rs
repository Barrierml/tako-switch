//! Self-contained statusline renderer for Claude Code, styled to match the
//! Tako CLI statusline exactly (same emojis, ANSI colors, ` │ ` separator).
//!
//!   📁 ~/ccgo │ 🌿 main ✓ │ 🤖 Opus 4.5 │ ⚡73% │ 💰 Session:$0.30
//!
//! Invoked as `tako-switch statusline`; Claude Code pipes JSON on stdin. No
//! dependency on the Tako CLI.

use std::io::Read;

// ANSI — mirror packages/cli/src/statusline/colors.ts
const RESET: &str = "\x1b[0m";
const BRIGHT_GREEN: &str = "\x1b[92m";
const BRIGHT_YELLOW: &str = "\x1b[93m";
const BRIGHT_BLUE: &str = "\x1b[94m";
const BRIGHT_MAGENTA: &str = "\x1b[95m";
const BRIGHT_CYAN: &str = "\x1b[96m";
const BRIGHT_BLACK: &str = "\x1b[90m";

pub fn render_statusline() {
    let mut input = String::new();
    let _ = std::io::stdin().read_to_string(&mut input);
    let json: serde_json::Value = serde_json::from_str(&input).unwrap_or_default();

    let sep = format!("{BRIGHT_BLACK} │ {RESET}");
    let mut parts: Vec<String> = Vec::new();

    if let Some(s) = seg_directory(&json) {
        parts.push(s);
    }
    if let Some(s) = seg_git(&json) {
        parts.push(s);
    }
    if let Some(s) = seg_model(&json) {
        parts.push(s);
    }
    if let Some(s) = seg_cost(&json) {
        parts.push(s);
    }

    println!("{}", parts.join(&sep));
}

fn seg_directory(json: &serde_json::Value) -> Option<String> {
    let dir = json.get("workspace")?.get("current_dir")?.as_str()?;
    let display = match std::env::var("HOME") {
        Ok(home) if dir == home => "~".to_string(),
        Ok(home) if dir.starts_with(&home) => format!("~{}", &dir[home.len()..]),
        _ => dir.to_string(),
    };
    Some(format!(
        "{BRIGHT_YELLOW}\u{1F4C1}{RESET} {BRIGHT_GREEN}{display}{RESET}"
    ))
}

fn seg_git(json: &serde_json::Value) -> Option<String> {
    let dir = json.get("workspace")?.get("current_dir")?.as_str()?;
    let head = std::path::Path::new(dir).join(".git").join("HEAD");
    let content = std::fs::read_to_string(head).ok()?;
    let branch = content.trim().strip_prefix("ref: refs/heads/")?;
    Some(format!(
        "{BRIGHT_BLUE}\u{1F33F}{RESET} {BRIGHT_BLUE}{branch}{RESET}"
    ))
}

fn seg_model(json: &serde_json::Value) -> Option<String> {
    let name = json.get("model")?.get("display_name")?.as_str()?;
    Some(format!(
        "{BRIGHT_CYAN}\u{1F916}{RESET} {BRIGHT_CYAN}{name}{RESET}"
    ))
}

fn seg_cost(json: &serde_json::Value) -> Option<String> {
    let cost = json.get("cost")?.get("total_cost_usd")?.as_f64()?;
    if cost <= 0.0 {
        return None;
    }
    Some(format!(
        "{BRIGHT_MAGENTA}\u{1F4B0}{RESET} {BRIGHT_GREEN}Session:${cost:.2}{RESET}"
    ))
}
