export function formatDate(date) {
  const localeDate = date.toLocaleDateString('en-US');
  const time = date.toLocaleTimeString('en-us', { hour12: false, timeStyle: 'short' });

  const formatted = `${localeDate}, ${time}`;

  return formatted;
}
