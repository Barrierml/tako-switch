import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LogIn, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTakoAuth } from "@/hooks/useTakoAuth";
import { startTakoLogin } from "@/lib/takoAuth";
import { toast } from "sonner";
import takoIcon from "@/assets/icons/app-icon.png";

const SEEN_FLAG = "tako_login_prompt_seen";

/**
 * 首次启动登录引导：仅在「从未弹过」且「未登录」时显示，可跳过。
 * 用 localStorage flag，不动后端 settings schema。
 */
export function LoginPromptDialog() {
  const { t } = useTranslation();
  const { loggedIn, loading, invalidate } = useTakoAuth();
  const [seen, setSeen] = useState(
    () => localStorage.getItem(SEEN_FLAG) === "1",
  );
  const [busy, setBusy] = useState(false);

  const isOpen = !loading && !loggedIn && !seen;

  const dismiss = () => {
    localStorage.setItem(SEEN_FLAG, "1");
    setSeen(true);
  };

  const handleLogin = async () => {
    setBusy(true);
    try {
      const r = await startTakoLogin();
      if (r.ok) {
        toast.success(`已登录${r.name ? `：${r.name}` : ""}`);
        invalidate();
        dismiss();
      } else {
        toast.error(r.error || "登录失败");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && dismiss()}>
      <DialogContent className="max-w-md" zIndex="top">
        <DialogHeader className="items-center text-center">
          <img src={takoIcon} alt="Tako" className="mx-auto h-10 w-10" />
          <DialogTitle className="text-lg font-semibold">
            {t("loginPrompt.title", { defaultValue: "登录 Tako 账号" })}
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            {t("loginPrompt.description", {
              defaultValue:
                "登录即可使用 Claude / Codex / Gemini，查看用量与额度。",
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-center">
          <Button
            className="gap-1.5 bg-gradient-to-r from-[#F06858] to-[#E8484A] text-white hover:brightness-110 shadow-sm"
            disabled={busy}
            onClick={handleLogin}
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            {t("loginPrompt.login", { defaultValue: "使用 Tako 账号登录" })}
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={dismiss}>
            {t("loginPrompt.later", { defaultValue: "稍后再说" })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
