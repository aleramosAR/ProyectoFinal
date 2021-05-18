export function formatDate(date) {
  const hh = date.getHours();
  const mm = date.getMinutes();
  const d = date.getDate();
  const m = date.getMonth();
  const y = date.getFullYear();

  return hh + ":" + mm + "hs. | " + d + "/" + m + "/" + y;
}