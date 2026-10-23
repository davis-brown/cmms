// "1975-04-12" or "1975-04-12T00:00:00.000Z" as "April 12, 1975". Dates are
// calendar days, so read the YYYY-MM-DD part and ignore the time zone.
export function formatDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value || ''));
  if (!match) return value || '';
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

// "18:30" or "18:30:00" as "6:30 PM"
export function formatTime(value) {
  const match = /^(\d{1,2}):(\d{2})/.exec(String(value || ''));
  if (!match) return value || '';
  return new Date(2000, 0, 1, Number(match[1]), Number(match[2]))
    .toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}
