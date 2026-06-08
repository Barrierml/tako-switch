import { invoke } from "@tauri-apps/api/core";

export interface RemoteStatus {
  installed: boolean;
  running: boolean;
  version: string | null;
}

/** #47 — auth handshake (复刻 happy web-auth). The frontend renders `web_url`
 * as a QR code, opens it in a browser, then polls with the keypair. */
export interface RemoteAuthBegin {
  web_url: string;
  public_key_b64: string;
  secret_key_b64: string;
}

export type RemoteAuthPoll = { state: "pending" } | { state: "authorized" };

export interface MigrationDetect {
  ccswitch_available: boolean;
  tako_cli_available: boolean;
  tako_account_id: string | null;
}

export async function remoteStatus(): Promise<RemoteStatus> {
  return invoke("remote_status");
}

/** Step 1: register an ephemeral keypair, get the URL to scan/open. */
export async function remoteAuthBegin(takoKey: string): Promise<RemoteAuthBegin> {
  return invoke("remote_auth_begin", { takoKey });
}

/** Step 2: poll once for authorization. On `authorized`, credentials are
 * written to access.key and the daemon can be started. */
export async function remoteAuthPoll(
  publicKeyB64: string,
  secretKeyB64: string,
): Promise<RemoteAuthPoll> {
  return invoke("remote_auth_poll", { publicKeyB64, secretKeyB64 });
}

/** Start the local daemon once credentials exist (after a successful poll). */
export async function remoteStartDaemon(): Promise<boolean> {
  return invoke("remote_start_daemon");
}

export async function remoteStopDaemon(): Promise<boolean> {
  return invoke("remote_stop_daemon");
}

export async function remoteInstall(): Promise<boolean> {
  return invoke("remote_install");
}

export async function migrationDetect(): Promise<MigrationDetect> {
  return invoke("migration_detect");
}

export async function migrationImportCcswitch(): Promise<boolean> {
  return invoke("migration_import_ccswitch");
}

export async function migrationImportTakoCli(): Promise<string> {
  return invoke("migration_import_tako_cli");
}

export async function takoStatuslineStatus(): Promise<boolean> {
  return invoke("tako_statusline_status");
}

export async function takoStatuslineEnable(): Promise<boolean> {
  return invoke("tako_statusline_enable");
}

export async function takoStatuslineDisable(): Promise<boolean> {
  return invoke("tako_statusline_disable");
}

export interface TakoUsageWindow {
  used: number;
  limit: number;
}

export interface TakoUsage {
  ok: boolean;
  window: TakoUsageWindow;
  daily: TakoUsageWindow;
  weekly: TakoUsageWindow;
  plan_name: string | null;
  error: string | null;
}

/** Fetch 5h / daily / weekly usage from par for a cr_ key. */
export async function takoUsage(apiKey: string): Promise<TakoUsage> {
  return invoke("tako_usage", { apiKey });
}

export interface TakoLoginResult {
  ok: boolean;
  name: string | null;
  plan: string | null;
  error: string | null;
}

/** Validate a cr_ key against par (no side effects). */
export async function takoLogin(apiKey: string): Promise<TakoLoginResult> {
  return invoke("tako_login", { apiKey });
}

/** Validate a cr_ key and, on success, write it into all Tako providers. */
export async function takoApplyKey(apiKey: string): Promise<TakoLoginResult> {
  return invoke("tako_apply_key", { apiKey });
}

export interface TakoModel {
  id: string;
  name: string;
  provider: string;
  /** 适用客户端：claude / codex / gemini。 */
  clients: string[];
}

/** List models Tako supports (via the gateway /v1/models, cr_ key auth). */
export async function takoListModels(apiKey: string): Promise<TakoModel[]> {
  return invoke("tako_list_models", { apiKey });
}

export interface TakoIdentity {
  logged_in: boolean;
  name: string | null;
  plan: string | null;
  offline: boolean;
}

/** Current login identity derived from the Tako provider key. */
export async function takoCurrentIdentity(): Promise<TakoIdentity> {
  return invoke("tako_current_identity");
}

/** Log out: clear the cr_ key from all Tako providers. */
export async function takoLogout(): Promise<boolean> {
  return invoke("tako_logout");
}
