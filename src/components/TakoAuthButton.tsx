import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LogOut, Loader2, UserRound, ChevronDown, KeyRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTakoAuth } from "@/hooks/useTakoAuth";
import { takoApplyKey, takoLogout } from "@/lib/api/tako";
import { settingsApi } from "@/lib/api/settings";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getIcon } from "@/icons/extracted";
import { useQueryClient } from "@tanstack/react-query";

const PORTAL = "https://tako.shiroha.tech";

function initial(name: string | null): string {
  const s = (name ?? "").trim();
  return s ? s[0].toUpperCase() : "T";
}

const AVATAR_GRADIENTS = [
  "from-[#F06858] to-[#E8484A]",
  "from-[#7C6CF0] to-[#5B4BD6]",
  "from-[#2FB8A8] to-[#1E9488]",
  "from-[#F0A93C] to-[#E08820]",
  "from-[#4A9DF0] to-[#2E7BD6]",
  "from-[#E85FA8] to-[#D63B8C]",
  "from-[#5FC36A] to-[#3DA84A]",
];

function avatarGradient(name: string | null): string {
  const s = (name ?? "").trim();
  if (!s) return AVATAR_GRADIENTS[0];
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0;
  return AVATAR_GRADIENTS[h % AVATAR_GRADIENTS.length];
}

export function TakoAuthButton() {
  const { t } = useTranslation();
  const { loggedIn, name, plan, offline, loading, invalidate } = useTakoAuth();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleKeyLogin = async () => {
    const key = keyInput.trim();
    if (!key) return;
    setBusy(true);
    try {
      const res = await takoApplyKey(key);
      if (res.ok) {
        toast.success(`已登录${res.name ? `：${res.name}` : ""}`);
        invalidate();
        queryClient.invalidateQueries({ queryKey: ["providers"] });
        setPopoverOpen(false);
        setKeyInput("");
      } else {
        toast.error(res.error || "Key 无效");
      }
    } catch (e) {
      toast.error(String(e));
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
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
            title={t("takoAuth.login", { defaultValue: "登录 Tako" })}
            className="group flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 transition-all hover:border-[var(--app-link)]/40 hover:bg-[var(--app-link)]/10 active:scale-95"
          >
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              {t("takoAuth.notLoggedIn", { defaultValue: "未登录" })}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72 p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-[#F06858]/10 to-[#F06858]/5 px-4 py-3 border-b border-border/40">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#F06858] to-[#E8484A] shadow-sm"
                dangerouslySetInnerHTML={{ __html: getIcon("tako") }}
              />
              <div>
                <p className="text-sm font-semibold">Tako Switch</p>
                <p className="text-xs text-muted-foreground">
                  {t("takoAuth.enterKeyHint", { defaultValue: "输入 API Key 登录所有服务" })}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <KeyRound className="h-3 w-3" />
                API Key
              </label>
              <Input
                type="password"
                placeholder="cr_..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleKeyLogin()}
                className="h-9 font-mono text-xs"
                autoFocus
              />
            </div>
            <Button
              className="w-full gap-2 bg-gradient-to-r from-[#F06858] to-[#E8484A] hover:brightness-110 text-white shadow-sm"
              disabled={busy || !keyInput.trim()}
              onClick={handleKeyLogin}
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <KeyRound className="h-4 w-4" />
              )}
              {t("takoAuth.loginBtn", { defaultValue: "登录" })}
            </Button>
            <p className="text-[10px] text-center text-muted-foreground/60">
              {t("takoAuth.keyScope", { defaultValue: "登录后将自动应用到所有服务商配置" })}
            </p>
          </div>
        </PopoverContent>
      </Popover>
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
