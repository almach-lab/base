/**
 * Format a date using Intl.DateTimeFormat.
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
  locale = "en-US"
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
}

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365;

/**
 * Format a date relative to now (e.g., "2 hours ago", "in 3 days").
 */
export function formatRelativeDate(date: Date | string | number, locale = "en-US"): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const diff = new Date(date).getTime() - Date.now();
  const absDiff = Math.abs(diff);

  if (absDiff < MINUTE) return rtf.format(Math.round(diff / SECOND), "second");
  if (absDiff < HOUR) return rtf.format(Math.round(diff / MINUTE), "minute");
  if (absDiff < DAY) return rtf.format(Math.round(diff / HOUR), "hour");
  if (absDiff < WEEK) return rtf.format(Math.round(diff / DAY), "day");
  if (absDiff < MONTH) return rtf.format(Math.round(diff / WEEK), "week");
  if (absDiff < YEAR) return rtf.format(Math.round(diff / MONTH), "month");
  return rtf.format(Math.round(diff / YEAR), "year");
}
