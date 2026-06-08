import {
  MonitorSmartphone,
  Download,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  RefreshCw,
  Power,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { settingsApi } from "@/lib/api/settings";
import type { TFunction } from "i18next";
import type { RemoteStatus, RemoteAuthBegin } from "@/lib/api/tako";

type Phase =
  | "loading"
  | "not-installed"
  | "installing"
  | "not-running"
  | "binding"
  | "running";

interface Props {
  phase: Phase;
  status: RemoteStatus | null;
  auth: RemoteAuthBegin | null;
  qrDataUrl: string;
  error: string;
  copied: boolean;
  loggedIn: boolean;
  onInstall: () => void;
  onBind: () => void;
  onCancelBind: () => void;
  onStop: () => void;
  onCopyUrl: () => void;
  onRefresh: () => void;
  t: TFunction;
}

export function RemotePanelBody(props: Props) {
  const { phase, t } = props;
  return (
    <div className="flex-1 glass-card rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-5 max-w-xl mx-auto w-full">
      <Header t={t} />
      {props.error && (
        <p className="text-sm text-red-400 max-w-md break-words">{props.error}</p>
      )}
      <Body {...props} />
      {phase !== "binding" && phase !== "loading" && (
        <button
          onClick={props.onRefresh}
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" /> {t("remote.refresh")}
        </button>
      )}
    </div>
  );
}

function Header({ t }: { t: TFunction }) {
  return (
    <>
      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
        <MonitorSmartphone className="w-10 h-10 text-primary" />
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-semibold">{t("remote.title")}</h3>
        <p className="text-muted-foreground max-w-md text-sm">
          {t("remote.subtitle")}
        </p>
      </div>
    </>
  );
}

function Body(props: Props) {
  const { phase, t } = props;
  if (phase === "loading")
    return <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />;

  if (!props.loggedIn)
    return <p className="text-sm text-muted-foreground">{t("remote.loginFirst")}</p>;

  if (phase === "not-installed")
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">{t("remote.installHint")}</p>
        <Button onClick={props.onInstall} className="gap-2">
          <Download className="w-4 h-4" /> {t("remote.install")}
        </Button>
      </div>
    );

  if (phase === "installing")
    return (
      <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" /> {t("remote.installing")}
      </div>
    );

  if (phase === "binding") return <BindingView {...props} />;

  if (phase === "running")
    return (
      <div className="space-y-3">
        <p className="text-sm text-green-400">{t("remote.runningHint")}</p>
        {props.status?.version && (
          <p className="text-xs text-muted-foreground">
            tako-remote {props.status.version}
          </p>
        )}
        <Button variant="outline" onClick={props.onStop} className="gap-2">
          <Power className="w-4 h-4" /> {t("remote.stop")}
        </Button>
      </div>
    );

  // not-running
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{t("remote.notRunningHint")}</p>
      <Button onClick={props.onBind} className="gap-2">
        <MonitorSmartphone className="w-4 h-4" /> {t("remote.bind")}
      </Button>
    </div>
  );
}

function BindingView(props: Props) {
  const { t, auth, qrDataUrl } = props;
  return (
    <div className="space-y-4 flex flex-col items-center">
      <p className="text-sm text-muted-foreground max-w-md">{t("remote.scanHint")}</p>
      {qrDataUrl ? (
        <img
          src={qrDataUrl}
          alt="QR"
          className="rounded-lg bg-white p-2"
          width={200}
          height={200}
        />
      ) : (
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      )}
      <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="w-3 h-3 animate-spin" /> {t("remote.waiting")}
      </div>
      <div className="flex gap-2">
        {auth && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => void settingsApi.openExternal(auth.web_url)}
            className="gap-1"
          >
            <ExternalLink className="w-3 h-3" /> {t("remote.openBrowser")}
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={props.onCopyUrl} className="gap-1">
          {props.copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {t("remote.copyUrl")}
        </Button>
        <Button variant="ghost" size="sm" onClick={props.onCancelBind}>
          {t("remote.cancel")}
        </Button>
      </div>
    </div>
  );
}
