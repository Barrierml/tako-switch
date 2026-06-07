//! Self-contained statusline renderer for Claude Code.
//!
//! Invoked as `tako-switch statusline` — Claude Code pipes a JSON payload on
//! stdin and shows whatever we print on stdout. This lives in the Tako Switch
//! binary itself so it has **no dependency on the Tako CLI** being installed.

use std::io::Read;

pub fn render_statusline() {
    let mut input = String::new();
    let _ = std::io::stdin().read_to_string(&mut input);

    let json: serde_json::Value = serde_json::from_str(&input).unwrap_or_default();

    let mut parts: Vec<String> = Vec::new();

    // Current directory (basename only).
    if let Some(dir) = json
        .get("workspace")
        .and_then(|w| w.get("current_dir"))
        .and_then(|d| d.as_str())
    {
        let base = std::path::Path::new(dir)
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or(dir);
        parts.push(format!("\u{1F4C1} {base}"));
    }

    // Git branch (cheap: read .git/HEAD).
    if let Some(branch) = git_branch(&json) {
        parts.push(format!("\u{2387} {branch}"));
    }

    // Model display name.
    if let Some(model) = json
        .get("model")
        .and_then(|m| m.get("display_name"))
        .and_then(|d| d.as_str())
    {
        parts.push(format!("\u{1F916} {model}"));
    }

    // Cost, if present.
    if let Some(cost) = json
        .get("cost")
        .and_then(|c| c.get("total_cost_usd"))
        .and_then(|v| v.as_f64())
    {
        if cost > 0.0 {
            parts.push(format!("${cost:.2}"));
        }
    }

    // Tako brand tail.
    parts.push("\u{1F419} Tako".to_string());

    println!("{}", parts.join("  "));
}

fn git_branch(json: &serde_json::Value) -> Option<String> {
    let dir = json
        .get("workspace")
        .and_then(|w| w.get("current_dir"))
        .and_then(|d| d.as_str())?;
    let head = std::path::Path::new(dir).join(".git").join("HEAD");
    let content = std::fs::read_to_string(head).ok()?;
    content
        .trim()
        .strip_prefix("ref: refs/heads/")
        .map(|s| s.to_string())
}
