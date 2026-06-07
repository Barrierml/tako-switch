//! 官方供应商种子数据
//!
//! 启动时调用 `Database::init_default_official_providers` 把这些条目
//! 写入 `providers` 表，让所有用户都能看到一个"一键切回官方"的入口。
//!
//! 字段与前端预设保持一致，参见：
//! - `src/config/claudeProviderPresets.ts`（"Claude Official"）
//! - `src/config/codexProviderPresets.ts`（"OpenAI Official"）
//! - `src/config/geminiProviderPresets.ts`（"Google Official"）

use crate::app_config::AppType;

pub(crate) const CLAUDE_DESKTOP_OFFICIAL_PROVIDER_ID: &str = "claude-desktop-official";

/// 单条官方供应商种子定义。
pub(crate) struct OfficialProviderSeed {
    pub id: &'static str,
    pub app_type: AppType,
    pub name: &'static str,
    pub website_url: &'static str,
    pub icon: &'static str,
    pub icon_color: &'static str,
    /// settings_config 的 JSON 字符串，每个 app 结构不同。
    pub settings_config_json: &'static str,
}

/// Claude / Claude Desktop / Codex / Gemini 的官方预设。
///
/// id 固定，便于幂等检查；name 直接用英文原名（与前端预设一致），不做 i18n。
pub(crate) const OFFICIAL_SEEDS: &[OfficialProviderSeed] = &[
    OfficialProviderSeed {
        id: "claude-official",
        app_type: AppType::Claude,
        name: "Claude Official",
        website_url: "https://www.anthropic.com/claude-code",
        icon: "anthropic",
        icon_color: "#D4915D",
        // 空 env 让用户走 Claude CLI 默认认证流程
        settings_config_json: r#"{"env":{}}"#,
    },
    OfficialProviderSeed {
        id: CLAUDE_DESKTOP_OFFICIAL_PROVIDER_ID,
        app_type: AppType::ClaudeDesktop,
        name: "Claude Desktop Official",
        website_url: "https://claude.ai/download",
        icon: "anthropic",
        icon_color: "#D4915D",
        // 空 env 只是占位；切换该 provider 时会恢复 Claude Desktop 1P 模式
        settings_config_json: r#"{"env":{}}"#,
    },
    OfficialProviderSeed {
        id: "codex-official",
        app_type: AppType::Codex,
        name: "OpenAI Official",
        website_url: "https://chatgpt.com/codex",
        icon: "openai",
        icon_color: "#00A67E",
        // 空 auth + 空 config 让用户走 ChatGPT Plus/Pro OAuth
        settings_config_json: r#"{"auth":{},"config":""}"#,
    },
    OfficialProviderSeed {
        id: "gemini-official",
        app_type: AppType::Gemini,
        name: "Google Official",
        website_url: "https://ai.google.dev/",
        icon: "gemini",
        icon_color: "#4285F4",
        // 空 env + 空 config 让用户走 Google OAuth
        settings_config_json: r#"{"env":{},"config":{}}"#,
    },
];

/// Tako 内置供应商种子。区别于官方预设：
/// - **永久存在**，每个 app 列表里都自动出现且排在第一位（sort_index 负值）；
/// - 指向 Tako 网关 `https://tako.shiroha.tech`，用 Tako 会员 cr_ key 鉴权。
/// 这是本产品的核心入口，不应被当作普通可删 provider。
pub(crate) const TAKO_PROVIDER_ID: &str = "tako-builtin";

pub(crate) const TAKO_SEEDS: &[OfficialProviderSeed] = &[
    OfficialProviderSeed {
        id: TAKO_PROVIDER_ID,
        app_type: AppType::Claude,
        name: "Tako",
        website_url: "https://tako.shiroha.tech",
        icon: "tako",
        icon_color: "#F06858",
        settings_config_json: r#"{"env":{"ANTHROPIC_BASE_URL":"https://tako.shiroha.tech","ANTHROPIC_AUTH_TOKEN":""}}"#,
    },
    OfficialProviderSeed {
        id: TAKO_PROVIDER_ID,
        app_type: AppType::Codex,
        name: "Tako",
        website_url: "https://tako.shiroha.tech",
        icon: "tako",
        icon_color: "#F06858",
        settings_config_json: r#"{"auth":{"OPENAI_API_KEY":""},"config":"model_provider = \"tako\"\n\n[model_providers.tako]\nname = \"Tako\"\nbase_url = \"https://tako.shiroha.tech/v1\""}"#,
    },
    OfficialProviderSeed {
        id: TAKO_PROVIDER_ID,
        app_type: AppType::Gemini,
        name: "Tako",
        website_url: "https://tako.shiroha.tech",
        icon: "tako",
        icon_color: "#F06858",
        settings_config_json: r#"{"env":{"GOOGLE_GEMINI_BASE_URL":"https://tako.shiroha.tech","GEMINI_API_KEY":""},"config":{}}"#,
    },
];

/// 判断给定的 provider id 是否属于内置官方种子。
///
/// 单一事实源：直接扫描 `OFFICIAL_SEEDS`，避免在多处重复维护 id 列表。
pub(crate) fn is_official_seed_id(id: &str) -> bool {
    OFFICIAL_SEEDS.iter().any(|seed| seed.id == id)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn official_seeds_include_claude_desktop() {
        let seed = OFFICIAL_SEEDS
            .iter()
            .find(|seed| seed.id == CLAUDE_DESKTOP_OFFICIAL_PROVIDER_ID)
            .expect("claude desktop official seed");

        assert_eq!(seed.app_type, AppType::ClaudeDesktop);
        assert!(is_official_seed_id(CLAUDE_DESKTOP_OFFICIAL_PROVIDER_ID));
    }
}
