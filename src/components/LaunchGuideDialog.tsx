import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Copy, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { settingsApi } from "@/lib/api/settings";

/** 各 app 的 CLI 安装命令（POSIX；Windows 无 install.sh，统一用 npm）。 */
const INSTALL_COMMANDS: Record<string, string> = {
  claude: "npm i -g @anthropic-ai/claude-code@latest",
  codex: "npm i -g @openai/codex@latest",
  gemini: "npm i -g @google/gemini-cli@latest",
  opencode: "npm i -g opencode-ai@latest",
  openclaw: "npm i -g openclaw@latest",
};

const APP_LABELS: Record<string, string> = {
  claude: "Claude Code",
  codex: "Codex",
  gemini: "Gemini CLI",
  opencode: "OpenCode",
  openclaw: "OpenClaw",
};

interface Props {
  isOpen: boolean;
  appId: string;
  /** true 表示装了但跑不起来（installed_but_broken），文案略不同。 */
  broken?: boolean;
  onClose: () => void;
}

/** CLI 未安装/损坏时的安装引导：给安装命令 + 复制 + Node 提示。 */
export function LaunchGuideDialog({ isOpen, appId, broken, onClose }: Props) {
  const { t } = useTranslation();
  const cmd = INSTALL_COMMANDS[appId] ?? "";
  const label = APP_LABELS[appId] ?? appId;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      toast.success(t("common.copied", { defaultValue: "已复制" }));
    } catch {
      toast.error(t("common.copyFailed", { defaultValue: "复制失败" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md" zIndex="alert">
        <DialogHeader className="space-y-3 border-b-0 bg-transparent pb-0">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Download className="h-5 w-5 text-[var(--app-link)]" />
            {broken
              ? t("launchGuide.brokenTitle", {
                  defaultValue: `${label} 无法运行`,
                  app: label,
                })
              : t("launchGuide.title", {
                  defaultValue: `需要先安装 ${label}`,
                  app: label,
                })}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            {t("launchGuide.description", {
              defaultValue:
                "在终端运行下面的命令安装。需要先装好 Node.js（≥ 18）。",
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
            <code className="flex-1 break-all text-xs">{cmd}</code>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={copy}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <button
            type="button"
            onClick={() => settingsApi.openExternal("https://nodejs.org/")}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {t("launchGuide.installNode", { defaultValue: "下载 Node.js" })}
          </button>
        </div>

        <DialogFooter className="flex gap-2 border-t-0 bg-transparent pt-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            {t("common.close", { defaultValue: "关闭" })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
