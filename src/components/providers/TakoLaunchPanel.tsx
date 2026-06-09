import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Play, FolderOpen, ChevronRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { takoListModels } from "@/lib/api/tako";
import { useSessionsQuery } from "@/lib/query";
import { getApiKeyFromConfig } from "@/utils/providerConfigUtils";
import { getIcon } from "@/icons/extracted";
import type { Provider } from "@/types";

interface Props {
  provider: Provider;
  expanded: boolean;
  frequentDirs: string[];
  selectedModel: string;
  onModelChange: (model: string) => void;
  onLaunch: (cwd: string) => void;
  onBrowseLaunch: () => void;
  onViewSessions: () => void;
  onExpand: () => void;
}

export function TakoLaunchPanel({
  provider,
  expanded,
  frequentDirs,
  selectedModel,
  onModelChange,
  onLaunch,
  onBrowseLaunch,
  onViewSessions,
  onExpand,
}: Props) {
  const { t } = useTranslation();

  const configStr = typeof provider.settingsConfig === "string"
    ? provider.settingsConfig
    : JSON.stringify(provider.settingsConfig ?? {});
  const apiKey = getApiKeyFromConfig(configStr, "claude");

  const { data: models } = useQuery({
    queryKey: ["tako-launch-models", apiKey],
    queryFn: () => takoListModels(apiKey),
    enabled: !!apiKey,
    staleTime: 5 * 60_000,
  });

  const { data: allSessions } = useSessionsQuery();
  const recentSessions = useMemo(() => {
    if (!allSessions) return [];
    return allSessions
      .filter((s) => s.providerId === "tako-builtin" && s.projectDir)
      .sort((a, b) => (b.lastActiveAt ?? 0) - (a.lastActiveAt ?? 0))
      .slice(0, 3);
  }, [allSessions]);

  // Collapsed mini bar
  if (!expanded) {
    return (
      <button
        type="button"
        onClick={onExpand}
        className="sticky bottom-0 -mx-1 mt-2 flex w-[calc(100%+0.5rem)] items-center gap-2 border-t border-border bg-background/95 px-4 py-2.5 backdrop-blur transition-colors hover:bg-muted/50"
      >
        <span
          className="flex h-4 w-4 items-center justify-center shrink-0"
          dangerouslySetInnerHTML={{ __html: getIcon("tako") }}
        />
        <span className="text-sm font-medium truncate">Tako</span>
        <span className="text-xs text-muted-foreground truncate">
          {selectedModel || "default"}
        </span>
        <Button size="sm" className="ml-auto gap-1 h-7" onClick={(e) => {
          e.stopPropagation();
          if (frequentDirs[0]) onLaunch(frequentDirs[0]);
          else onBrowseLaunch();
        }}>
          <Play className="h-3 w-3" />
          {t("provider.launch", "启动")}
        </Button>
      </button>
    );
  }

  // Expanded panel
  return (
    <div className="sticky bottom-0 -mx-1 mt-2 border-t border-border/60 bg-gradient-to-t from-background via-background to-background/95 backdrop-blur overflow-hidden shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.08)]">
      <div className="px-4 py-3 space-y-3">
        {/* Model selector — compact top bar */}
        {models && models.length > 0 && (
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider shrink-0">
              {t("provider.model", { defaultValue: "模型" })}
            </span>
            <Select value={selectedModel || "__default__"} onValueChange={(v) => onModelChange(v === "__default__" ? "" : v)}>
              <SelectTrigger className="h-7 text-xs flex-1 border-none bg-muted/40 shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[240px]">
                <SelectItem value="__default__">
                  {t("provider.modelDefault", { defaultValue: "默认" })}
                </SelectItem>
                {models.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    <span className="font-mono text-xs">{m.id}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Launch buttons — primary, most prominent */}
        <div className="space-y-1">
          {frequentDirs.map((dir, i) => (
            <button
              key={dir}
              type="button"
              onClick={() => onLaunch(dir)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all active:scale-[0.99]",
                i === 0
                  ? "bg-[var(--app-link)]/8 border border-[var(--app-link)]/25 hover:bg-[var(--app-link)]/15 hover:border-[var(--app-link)]/40 shadow-sm"
                  : "border border-border/40 hover:bg-muted/60 hover:border-border",
              )}
            >
              <Terminal className={cn("h-4 w-4 shrink-0", i === 0 ? "text-[var(--app-link)]" : "text-muted-foreground")} />
              <span className="truncate flex-1 text-left font-medium">
                {dir.replace(/^\/Users\/[^/]+\//, "~/")}
              </span>
              <Play className={cn("h-3.5 w-3.5 shrink-0 transition-opacity", i === 0 ? "text-[var(--app-link)]" : "text-muted-foreground opacity-0 group-hover:opacity-100")} />
            </button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="w-full gap-2 text-muted-foreground hover:text-foreground"
            onClick={onBrowseLaunch}
          >
            <FolderOpen className="h-4 w-4" />
            {t("provider.launchBrowse", { defaultValue: "选择文件夹启动" })}
          </Button>
        </div>

        {/* Recent sessions — tertiary */}
        {recentSessions.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                {t("provider.recentSessions", { defaultValue: "最近会话" })}
              </span>
              <button
                type="button"
                onClick={onViewSessions}
                className="flex items-center gap-0.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("common.viewAll", { defaultValue: "全部" })}
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-0.5">
              {recentSessions.map((s) => (
                <button
                  key={s.sessionId}
                  type="button"
                  onClick={() => s.projectDir && onLaunch(s.projectDir)}
                  className="shrink-0 rounded-md border border-border/40 bg-muted/20 px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors max-w-[140px] truncate"
                  title={s.title || s.projectDir || ""}
                >
                  {s.projectDir?.replace(/^\/Users\/[^/]+\//, "~/")?.split("/").pop() || s.title || "session"}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
