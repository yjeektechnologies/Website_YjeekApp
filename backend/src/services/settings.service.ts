import { Setting } from "../models/setting.model.js";

/** Map of setting key → value. Missing keys are simply absent. */
export type SettingMap = Record<string, string>;

/** Fetch a set of settings by key as a plain dictionary for O(1) lookups. */
export async function getSettingsMap(keys: readonly string[]): Promise<SettingMap> {
  if (keys.length === 0) return {};

  const rows = await Setting.find({ _id: { $in: [...keys] } }).lean();
  return Object.fromEntries(rows.map((row) => [row._id as string, row.value]));
}

/** Insert or update a single setting. */
export async function upsertSetting(key: string, value: string): Promise<void> {
  await Setting.updateOne(
    { _id: key },
    { $set: { value, updatedAt: new Date() } },
    { upsert: true },
  );
}

/**
 * Insert/update many settings. Sequential (not bulk) so a failure on one key is
 * localised and does not silently skip the remaining writes — matches the
 * original behaviour.
 */
export async function upsertManySettings(entries: SettingMap): Promise<void> {
  for (const [key, value] of Object.entries(entries)) {
    await upsertSetting(key, value);
  }
}
