import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LogIn, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

/** 取名字/邮箱首字母作头像（verify-identity 不返回头像图片）。 */
function initial(name: string | null): string {
  const s = (name ?? "").trim();
  return s ? s[0].toUpperCase() : "T";
}

/** 顶部 Tako 登录入口：未登录显示登录按钮，已登录显示头像 + 菜单。 */
export function TakoAuthButton() {
  const { t } = useTranslation();
  const { loggedIn, name, plan, loading, invalidate } = useTakoAuth();
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
      <Button variant="ghost" size="icon" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (!loggedIn) {
    return (
      <Button
        size="sm"
        className="gap-1.5 bg-[var(--app-link)] text-[var(--app-bg)] hover:opacity-90"
        disabled={busy}
        onClick={handleLogin}
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="h-4 w-4" />
        )}
        {t("takoAuth.login", { defaultValue: "登录 Tako" })}
      </Button>
    );
  }

  return (
    <div style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 hover:bg-black/5 dark:hover:bg-white/5"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--app-link)] text-xs font-semibold text-[var(--app-bg)]">
              {initial(name)}
            </span>
            <span className="max-w-[120px] truncate text-sm">
              {name ?? t("takoAuth.account", { defaultValue: "Tako 账号" })}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="flex flex-col">
            <span className="truncate">{name ?? "Tako"}</span>
            {plan && (
              <span className="text-xs font-normal text-muted-foreground">
                {plan}
              </span>
            )}
          </DropdownMenuLabel>
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
