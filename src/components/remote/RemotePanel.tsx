import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "qrcode";
import { settingsApi } from "@/lib/api/settings";
import { useTakoAuth } from "@/hooks/useTakoAuth";
import { RemotePanelBody } from "@/components/remote/RemotePanelBody";
import {
  remoteStatus,
  remoteInstall,
  remoteAuthBegin,
  remoteAuthPoll,
  remoteStartDaemon,
  remoteStopDaemon,
  type RemoteStatus,
  type RemoteAuthBegin,
} from "@/lib/api/tako";

type Phase =
  | "loading"
  | "not-installed"
  | "installing"
  | "not-running"
  | "binding"
  | "running";

const POLL_INTERVAL_MS = 2000;

export function RemotePanel() {
  const { t } = useTranslation();
  const { loggedIn } = useTakoAuth();

  const [phase, setPhase] = useState<Phase>("loading");
  const [status, setStatus] = useState<RemoteStatus | null>(null);
  const [auth, setAuth] = useState<RemoteAuthBegin | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── status detection ────────────────────────────────────────────
  const refreshStatus = async () => {
    try {
      const s = await remoteStatus();
      setStatus(s);
      if (!s.installed) setPhase("not-installed");
      else if (s.running) setPhase("running");
      else setPhase("not-running");
    } catch (e) {
      setError(String(e));
      setPhase("not-installed");
    }
  };

  useEffect(() => {
    void refreshStatus();
    return () => stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopPolling = () => {
    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
  };

  // ── install ─────────────────────────────────────────────────────
  const handleInstall = async () => {
    setError("");
    setPhase("installing");
    try {
      await remoteInstall();
      await refreshStatus();
    } catch (e) {
      setError(String(e));
      setPhase("not-installed");
    }
  };

  // ── bind (auth handshake) ───────────────────────────────────────
  const handleBind = async () => {
    setError("");
    setPhase("binding");
    try {
      const begin = await remoteAuthBegin();
      setAuth(begin);
      setQrDataUrl(await QRCode.toDataURL(begin.web_url, { width: 240, margin: 1 }));
      void settingsApi.openExternal(begin.web_url);
      startPolling(begin);
    } catch (e) {
      setError(String(e));
      setPhase("not-running");
    }
  };

  const startPolling = (begin: RemoteAuthBegin) => {
    stopPolling();
    pollTimer.current = setInterval(async () => {
      try {
        const r = await remoteAuthPoll(begin.public_key_b64, begin.secret_key_b64);
        if (r.state === "authorized") {
          stopPolling();
          await remoteStartDaemon();
          setAuth(null);
          setQrDataUrl("");
          await refreshStatus();
        }
      } catch (e) {
        stopPolling();
        setError(String(e));
        setPhase("not-running");
      }
    }, POLL_INTERVAL_MS);
  };

  const cancelBind = () => {
    stopPolling();
    setAuth(null);
    setQrDataUrl("");
    setPhase("not-running");
  };

  // ── daemon stop ─────────────────────────────────────────────────
  const handleStop = async () => {
    setError("");
    try {
      await remoteStopDaemon();
      await refreshStatus();
    } catch (e) {
      setError(String(e));
    }
  };

  const copyUrl = async () => {
    if (!auth) return;
    await navigator.clipboard.writeText(auth.web_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="px-6 flex flex-col flex-1 min-h-0">
      <RemotePanelBody
        phase={phase}
        status={status}
        auth={auth}
        qrDataUrl={qrDataUrl}
        error={error}
        copied={copied}
        loggedIn={loggedIn}
        onInstall={handleInstall}
        onBind={handleBind}
        onCancelBind={cancelBind}
        onStop={handleStop}
        onCopyUrl={copyUrl}
        onRefresh={refreshStatus}
        t={t}
      />
    </div>
  );
}
