import { listen } from "@tauri-apps/api/event";
import { settingsApi } from "@/lib/api/settings";
import { takoApplyKey, type TakoLoginResult } from "@/lib/api/tako";

/** par 授权页基址（公网网关，桌面端跑在终端用户机器上）。 */
const AUTHORIZE_URL = "https://tako.shiroha.tech/app/authorize";

interface TakoAuthEvent {
  key: string;
  state: string | null;
}

export interface StartLoginResult {
  ok: boolean;
  name?: string | null;
  plan?: string | null;
  error?: string;
}

/** 生成一次性 state（CSRF 防护：仅本地比对）。 */
function genState(): string {
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * 发起 Tako OAuth 桌面授权：打开浏览器授权页，等待 takoswitch:// 深链回跳。
 *
 * - 生成并持有 state，回跳事件必须携带相同 state 才接受（防注入）。
 * - 收到 key 后调 takoApplyKey 验证并写入 Tako provider。
 * - timeoutMs 内未回跳则放弃监听（用户可改用手动粘贴兜底）。
 */
export async function startTakoLogin(
  timeoutMs = 5 * 60 * 1000,
): Promise<StartLoginResult> {
  const state = genState();

  return new Promise<StartLoginResult>((resolve) => {
    let settled = false;
    let unlisten: (() => void) | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const cleanup = () => {
      if (timer) clearTimeout(timer);
      if (unlisten) unlisten();
    };

    const finish = (r: StartLoginResult) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(r);
    };

    listen<TakoAuthEvent>("tako-auth", async (event) => {
      const payload = event.payload;
      // state 不匹配 → 不是本次发起的回跳，忽略。
      if (payload.state !== state) return;
      try {
        const res: TakoLoginResult = await takoApplyKey(payload.key);
        finish({
          ok: res.ok,
          name: res.name,
          plan: res.plan,
          error: res.error ?? undefined,
        });
      } catch (e) {
        finish({ ok: false, error: String(e) });
      }
    })
      .then((un) => {
        unlisten = un;
        // 监听就绪后再打开浏览器，避免回跳过快错过事件。
        const url = `${AUTHORIZE_URL}?state=${encodeURIComponent(state)}&redirect=takoswitch`;
        settingsApi.openExternal(url).catch((e) => {
          finish({ ok: false, error: `无法打开浏览器: ${e}` });
        });
        timer = setTimeout(() => {
          finish({ ok: false, error: "授权超时，请重试或使用手动粘贴" });
        }, timeoutMs);
      })
      .catch((e) => {
        finish({ ok: false, error: `监听失败: ${e}` });
      });
  });
}
