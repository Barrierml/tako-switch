import { invoke } from "@tauri-apps/api/core";

export interface RemoteStatus {
  installed: boolean;
  running: boolean;
  version: string | null;
}

export interface MigrationDetect {
  ccswitch_available: boolean;
  tako_cli_available: boolean;
  tako_account_id: string | null;
}

export async function remoteStatus(): Promise<RemoteStatus> {
  return invoke("remote_status");
}

export async function remoteStartDaemon(takoKey: string): Promise<string> {
  return invoke("remote_start_daemon", { takoKey });
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
