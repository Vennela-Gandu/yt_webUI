/**
 * The blog runs on one editorial clock: India Standard Time. A publish time
 * typed into the admin form always means IST, whatever zone the editor's
 * machine is in, and the site shows post dates in IST too.
 *
 * IST is a fixed UTC+05:30 with no daylight saving, so a constant offset is
 * exact — no timezone library needed.
 */
export const IST_OFFSET_MINUTES = 330;
export const IST_LABEL = 'IST';

/** Angular date-pipe timezone argument, e.g. {{ d | date:'short':IST_TZ }}. */
export const IST_TZ = '+0530';

/**
 * The API stores and returns post dates in UTC, but without a zone suffix
 * ("2026-08-23T08:30:00"). Passing that straight to Angular's date pipe would
 * read it as the reader's local time and shift it. Mark it as UTC first.
 */
export function toUtcDate(value: any): Date | null {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;

  const raw = String(value);
  const hasZone = /[Zz]|[+-]\d{2}:?\d{2}$/.test(raw);
  const date = new Date(hasZone ? raw : raw + 'Z');

  return isNaN(date.getTime()) ? null : date;
}

/**
 * Reads what the admin typed into <input type="datetime-local">
 * ("2026-08-23T14:30") as an IST wall-clock time and returns the matching UTC
 * instant for the API. Deliberately ignores the browser's own zone.
 */
export function istInputToUtcIso(value: any): string | null {
  if (!value) return null;

  const match = String(value)
    .match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/);

  if (!match) {
    // Already a Date or a zoned string — keep the instant it names.
    const parsed = toUtcDate(value);
    return parsed ? parsed.toISOString() : null;
  }

  const [, year, month, day, hour, minute] = match.map(Number) as any;
  const asIfUtc = Date.UTC(year, month - 1, day, hour, minute);

  return new Date(asIfUtc - IST_OFFSET_MINUTES * 60000).toISOString();
}

/**
 * The reverse: turns the stored UTC value into the IST wall-clock string
 * <input type="datetime-local"> expects, so editing a post shows the same time
 * that was scheduled.
 */
export function utcToIstInputValue(value: any): string | null {
  const date = toUtcDate(value);
  if (!date) return null;

  const ist = new Date(date.getTime() + IST_OFFSET_MINUTES * 60000);
  const pad = (n: number) => String(n).padStart(2, '0');

  return `${ist.getUTCFullYear()}-${pad(ist.getUTCMonth() + 1)}-${pad(ist.getUTCDate())}`
       + `T${pad(ist.getUTCHours())}:${pad(ist.getUTCMinutes())}`;
}

/**
 * Adds the display fields the blog templates need: real Date objects, and
 * whether the post carries an "Updated" stamp worth showing (the API only sets
 * UpdatedDate when an already-published post was edited).
 */
export function withPostDates<T extends Record<string, any>>(post: T): T {
  const publishedDate = toUtcDate(post['publishedDate']);
  const updatedDate = toUtcDate(post['updatedDate']);

  return {
    ...post,
    publishedDate,
    updatedDate,
    // Guard against a stamp that is the same second as publishing, which would
    // show "Updated" on a post nobody has actually revised.
    wasUpdated: !!(updatedDate && publishedDate && updatedDate > publishedDate)
  };
}
