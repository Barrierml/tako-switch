import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LogIn, LogOut, Loader2, UserRound, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTakoAuth } from "@/hooks/useTakoAuth";
import { startTakoLogin } from "@/lib/takoAuth";
import { takoLogout } from "@/lib/api/tako";
import { settingsApi } from "@/lib/api/settings";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/** Tako portal 基址。 */
const PORTAL = "https://tako.shiroha.tech";

/** 取名字/邮箱首字母作头像（verify-identity 不返回头像图片）。 */
function initial(name: string | null): string {
  const s = (name ?? "").trim();
  return s ? s[0].toUpperCase() : "T";
}

/** 头像渐变色板：按 name 哈希取一组，保证同一账号颜色稳定。 */
const AVATAR_GRADIENTS = [
  "from-[#F06858] to-[#E8484A]", // Tako 橙红
  "from-[#7C6CF0] to-[#5B4BD6]", // 紫
  "from-[#2FB8A8] to-[#1E9488]", // 青
  "from-[#F0A93C] to-[#E08820]", // 琥珀
  "from-[#4A9DF0] to-[#2E7BD6]", // 蓝
  "from-[#E85FA8] to-[#D63B8C]", // 粉
  "from-[#5FC36A] to-[#3DA84A]", // 绿
];

/** 把名字稳定映射到一个渐变（djb2 哈希）。 */
function avatarGradient(name: string | null): string {
  const s = (name ?? "").trim();
  if (!s) return AVATAR_GRADIENTS[0];
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0;
  return AVATAR_GRADIENTS[h % AVATAR_GRADIENTS.length];
}

/** 顶部 Tako 登录入口：未登录显示登录按钮，已登录显示头像 + 菜单。 */
export function TakoAuthButton() {
  const { t } = useTranslation();
  const { loggedIn, name, plan, offline, loading, invalidate } = useTakoAuth();
  const [busy, setBusy] = useState(false);

  const handleLogin = async () => {
    setBusy(true);
    try {
      const r = await startTakoLogin();
      if (r.ok) {
        toast.success(`已登录${r.name ? `：${r.name}` : ""}`);
        invalidate();
      } else {
        toast.error(r.error || "登录失败");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    try {
      await takoLogout();
      toast.success(t("takoAuth.loggedOut", { defaultValue: "已登出" }));
      invalidate();
    } catch (e) {
      toast.error(String(e));
    }
  };

  if (loading) {
    return (
      <div
        className="flex h-9 w-9 items-center justify-center"
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
      >
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={handleLogin}
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--app-link)] to-[#F06858] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-[var(--app-link)]/30 transition-all hover:shadow-md hover:shadow-[var(--app-link)]/40 hover:brightness-105 active:scale-95 disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="h-4 w-4" />
        )}
        {t("takoAuth.login", { defaultValue: "登录 Tako" })}
      </button>
    );
  }

  return (
    <div style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-border/60 bg-background/60 py-1 pl-1 pr-2 transition-colors hover:border-[var(--app-link)]/40 hover:bg-[var(--app-link)]/5"
          >
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white shadow-sm",
                avatarGradient(name),
              )}
            >
              {initial(name)}
            </span>
            <span className="max-w-[120px] truncate text-sm font-medium">
              {name ?? t("takoAuth.account", { defaultValue: "Tako 账号" })}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="flex items-center gap-2.5 py-2">
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white",
                avatarGradient(name),
              )}
            >
              {initial(name)}
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold">
                {name ?? "Tako"}
              </span>
              {plan ? (
                <span className="truncate text-xs font-normal text-[var(--app-link)]">
                  {plan}
                </span>
              ) : offline ? (
                <span className="text-xs font-normal text-muted-foreground">
                  {t("takoAuth.offline", { defaultValue: "离线" })}
                </span>
              ) : null}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => settingsApi.openExternal(`${PORTAL}/app/dashboard`)}
          >
            <UserRound className="mr-2 h-4 w-4" />
            {t("takoAuth.profile", { defaultValue: "个人信息" })}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-500">
            <LogOut className="mr-2 h-4 w-4" />
            {t("takoAuth.logout", { defaultValue: "登出" })}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
